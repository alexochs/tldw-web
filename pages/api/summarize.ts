// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next'
//import NextCors from 'nextjs-cors';
import { Configuration, OpenAIApi } from 'openai';
const {encode, decode} = require('gpt-3-encoder')

const apiKey = "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";
const publicUserId = "644e9b54-f467-4fca-bbe5-546efa86c972";

import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: "*"
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, async (result: any) => {
      if (result instanceof Error) {
        console.log("Some error shit!");
        return reject(result)
      }

      const { videoId, title, channel, userId } = req.query;

      console.log("Checking if videoId and title are present...");
      if (!videoId || !title || !channel || !userId) {
        res.status(400).json({
          message: "Missing videoId, title, channel or userId!",
          error: true
        });
        return;
      }

      console.log("Checking if video is already summarized...");
      const supabase = createClient("https://qkcvptzdmjknqfuzgpqu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY3ZwdHpkbWprbnFmdXpncHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM1MzYzMjMsImV4cCI6MTk4OTExMjMyM30.vwBbbWx5nXM6NF6OlOIb6rX4s7sXywmzoRwTCcOHAv4");
      const summaryRes = await supabase
        .from('summaries')
        .select('*')
        .eq("video_id", videoId);

      if (!summaryRes.error && summaryRes.data[0]) {
        console.log("Found video in database!");
        const summary = summaryRes.data[0];

        if (summary.complete) {
          console.log("Video is already completely summarized!");
          res.status(200).json({
            message:summary.summary,
            lastTimestamp: summary.last_timestamp,
            error: false,
            complete: summary.complete,
          });
          return;
        } else {
          console.log("Video is not completely summarized!");
          console.log("Creating new prompt...");
          
          console.log("Checking if user is authenticated...");
          console.log("userId: " + userId);
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq("id", userId);

          if (error) {
            res.status(400).json({
              message: "Error fetching profiles!",
              error: true
            });
            return;
          }

          if (data[0].id !== userId) {
            res.status(400).json({
              message: "Unauthenticated!",
              error: true
            });
            return;
          }

          console.log("Fetching transcription...");
          const metadataResponse = await fetch(`https://tldw-python.vercel.app/api?videoId=${videoId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
          }});
          const metadataData = await metadataResponse.json();

          if (!metadataData || metadataData.error) {
            res.status(400).json({
              message: "Missing transcription!",
              error: true
            });
            return;
          }
          const metadata = metadataData.metadata;

          console.log("Creating prompt..." + title);
          let prompt = "";
          let transcription = "";
          let lastTimestamp = summary.last_timestamp;
          console.log("Last timestamp: " + lastTimestamp);
          let complete = false;
          for (let i = 0; i < metadata.length; i++) {
            const segment = metadata[i];
            if (Math.round(segment.start as number + segment.duration as number) <= lastTimestamp) continue;
            transcription += segment.text + " ";
            const _prompt = 'Continue to summarize this video by ' + channel + ' with the title "' + title.slice(0, title.length - 1) + '" and the following transcript: "' + transcription + '"';
            const tokens = encode(_prompt).length;
            if (tokens > 3840) break;
            prompt = _prompt;
            lastTimestamp = Math.round(segment.start as number + segment.duration as number);
            complete = (i == metadata.length - 1);
          }

          console.log("Last timestamp: " + lastTimestamp);
          console.log("Creating completion...");
          const configuration = new Configuration({apiKey});
          const openai = new OpenAIApi(configuration);
          const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 256,
          });

          if (response.data.choices[0].text === "undefined") {
            res.status(400).json({
              message: "Error creating completion!",
              error: true
            });
            return;
          }

          // update database with new summary
          console.log("Saving summary into database...");
          console.log("Complete: " + complete);
          const saveResponse = await supabase
            .from('summaries')
            .insert([{
              video_id: videoId, 
              summary: summary.summary + response.data.choices[0].text as string, 
              last_timestamp: lastTimestamp,
              complete: complete,
            },]);

          if (saveResponse.error) {
            res.status(400).json({
              message: "Error saving summary!",
              error: true
            });
            return;
          }

          console.log("Successfully created summary!");
          res.status(200).json({
            message: response.data.choices[0].text as string,
            lastTimestamp: lastTimestamp,
            error: false,
            complete: complete,
          });

          return resolve(result)
        }
      }

      console.log("Creating new summary...");

      console.log("Checking if user is authenticated...");
      console.log("userId: " + userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq("id", userId);

      if (error) {
        res.status(400).json({
          message: "Error fetching profiles!",
          error: true
        });
        return;
      }

      if (data[0].id !== userId) {
        res.status(400).json({
          message: "Unauthenticated!",
          error: true
        });
        return;
      }

      console.log("Fetching transcription...");
      const metadataResponse = await fetch(`https://tldw-python.vercel.app/api?videoId=${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
      }});
      const metadataData = await metadataResponse.json();

      if (!metadataData || metadataData.error) {
        res.status(400).json({
          message: "Missing transcription!",
          error: true
        });
        return;
      }
      const metadata = metadataData.metadata;

      console.log("Creating prompt..." + title);
      let prompt = "";
      let transcription = "";
      let lastTimestamp = 0;
      let complete = false;
      for (let i = 0; i < metadata.length; i++) {
        const segment = metadata[i];
        transcription += segment.text + " ";
        const _prompt = 'Summarize this video by ' + channel + ' with the title "' + title.slice(0, title.length - 1) + '" and the following transcript: "' + transcription + '"';
        const tokens = encode(_prompt).length;
        if (tokens > 3840) break;
        prompt = _prompt;
        lastTimestamp = Math.round(segment.start as number + segment.duration as number);
        complete = i == metadata.length - 1;
      }

      console.log("Last timestamp: " + lastTimestamp);
      console.log("Creating completion...");
      const configuration = new Configuration({apiKey});
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 256,
      });

      if (response.data.choices[0].text === "undefined") {
        res.status(400).json({
          message: "Error creating completion!",
          error: true
        });
        return;
      }

      console.log("Saving summary into database...");
      console.log("Complete: " + complete);
      const saveResponse = await supabase
        .from('summaries')
        .insert([{
          video_id: videoId, 
          summary: response.data.choices[0].text as string, 
          last_timestamp: lastTimestamp,
          complete,
        },]);

      if (saveResponse.error) {
        res.status(400).json({
          message: "Error saving summary!",
          error: true
        });
        return;
      }

      console.log("Successfully created summary!");
      res.status(200).json({
        message: response.data.choices[0].text as string,
        lastTimestamp: lastTimestamp,
        error: false,
        complete,
      });

      return resolve(result)
    })
  })
}

type Result = {
  message: string,
  error: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  await runMiddleware(req, res, cors);
}
