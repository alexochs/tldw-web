// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';

type Summary = {
  id: string,
  created_at: boolean,
  summary: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
   });

  const { videoId } = req.query;

  const supabase = createClient("https://qkcvptzdmjknqfuzgpqu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY3ZwdHpkbWprbnFmdXpncHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM1MzYzMjMsImV4cCI6MTk4OTExMjMyM30.vwBbbWx5nXM6NF6OlOIb6rX4s7sXywmzoRwTCcOHAv4");
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq("video_id", videoId);

  if (error) {
    res.status(400).json({
      message: "Error fetching summary!",
      error: true
    });
    return;
  }

  if (!data[0]) {
    res.status(400).json({
      message: "Summary not found!",
      error: true
    });
    return;
  }

  console.log("Successfully found summary for videoId: " + videoId + "!");
  res.status(200).json(data[0]);
}
