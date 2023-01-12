// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next'
//import NextCors from 'nextjs-cors';
import { Configuration, OpenAIApi } from 'openai';

const apiKey = "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";

type Result = {
  message: string,
  error: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  /*await NextCors(req, res, {
      methods: ['GET'],
      origin: 'https://www.youtube.com/*',
      optionsSuccessStatus: 200,
   });*/

  const { videoId, title, userId } = req.query;

  console.log("Checking if videoId and title are present...");
  if (!videoId || !title) {
    res.status(400).json({
      message: "Missing videoId or title!",
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
    res.status(200).json({
      message: summaryRes.data[0].summary,
      error: false
    });
    return;
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
  const transcriptionResponse = await fetch(`https://tldw-python.vercel.app/api?videoId=${videoId}&title=${title}`);
  const transcription = await transcriptionResponse.json();

  if (!transcription) {
    res.status(400).json({
      message: "Missing transcription!",
      error: true
    });
    return;
  }

  console.log("Creating prompt...");
  const prompt = 'Summarize a YouTube Video with the title "' + title + '" and the following transcript: "' + transcription.transcript + '"';

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
  const { data: summaryData, error: summaryError } = await supabase
    .from('summaries')
    .insert([
      { video_id: videoId, summary: response.data.choices[0].text as string },
    ]);

  if (summaryError) {
    res.status(400).json({
      message: "Error saving summary!",
      error: true
    });
    return;
  }

  console.log("Successfully created summary!");
  res.status(200).json({
     message: response.data.choices[0].text as string,
     error: false
  });
}
