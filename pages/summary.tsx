import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Heading, Input, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

function youtube_parser(url: any){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

/* get server side props
export async function getServerSideProps(context: any) {
  const { query } = context;
  const { url } = query;

  const videoId = youtube_parser(url);

  console.log("Fetching video with id: " + videoId + "");
  const response = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + "AIzaSyDTE6cLA6Bbd0Z4kGVKUTXwke90lYHCIgo");
  const data = await response.json();
  let summary = null;

  let title = null;
  if (data.items.length > 0) {
    title = data.items[0].snippet.title;
    const response = await fetch("http://tldw.alexochs.de/api/summarize?videoId=" + videoId + "&title=" + title.replaceAll(" ", "%20%") + "&userId=644e9b54-f467-4fca-bbe5-546efa86c972");
    summary = await response.json();
  }
  
  summary.title = title;
  console.log(summary);

  return {
    props: {
      summary
    }
  }
}*/

export default function Summary({url}: any) {
  const router = useRouter();

  const [title, setTitle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [value, setValue] = useState('')
  const handleChange = (event: any) => setValue(event.target.value)

  useEffect(() => {
    if (!url) {
      alert("No URL provided! Redirecting to home page...");
      router.push("/");
      return;
    }

    const videoId = youtube_parser(url);
    if (!videoId) {
      alert("No valid URL provided! Redirecting to home page...");
      router.push("/");
      return;
    }

    console.log("Fetching video with id: " + videoId + "");
    fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + "AIzaSyDTE6cLA6Bbd0Z4kGVKUTXwke90lYHCIgo")
      .then(response => {
        const data = response.json().then(async (data: any) => {
          if (data.items.length > 0) {
            setTitle(data.items[0].snippet.title);
            //const response = await fetch("http://tldw.alexochs.de/api/summarize?videoId=" + videoId + "&title=" + title.replaceAll(" ", "%20%") + "&userId=644e9b54-f467-4fca-bbe5-546efa86c972");
            //summary = await response.json();
          }
        });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Too Lazy; Didn&apos;t Watch - YouTube Summary by AI</title>
        <meta name="description" content="Too Lazy; Didn&apos;t Watch - YouTube Summary by AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box w="100vw" minH="100vh" flexDir={"column"} fontSize="xl" pt="2rem" bg="rgb(232, 220, 202)">
          <Link href="/">
            <Center>
              <Heading fontSize={["5xl", "8xl"]}>
                Too Lazy; 🥱<br/>Didn&apos;t Watch 👀
              </Heading>
            </Center>
            <Center>
              <Text fontSize={["md", "3xl"]} fontWeight={"normal"} pl="1rem" pr="2rem">
                YouTube summaries made by AI 🤖
              </Text>
            </Center>
          </Link>
          <Box py="2rem"/>
          <Center>
            <Heading>{title}</Heading>
            {summary ? <Stack w={["95vw", "36rem"]} px="2.5vw">
              {summary.message.split(".").map((sentence: string, id: any) => {
                return (
                  <Text key={id}>{sentence}</Text>
                )
              })
              }
            </Stack> : <Spinner size="xl"/>}
          </Center>
        </Box>
        <Center py="1rem" bg="rgb(232, 220, 202)">
          <Link href="https://alexochs.de" target="_blank">
            <Text fontSize={["xs", "md"]}>Made with ❤️ by <b>Alex Ochs - Web & Software Developer 👨🏻‍💻</b></Text>
          </Link>
        </Center>
      </main>
    </>
  )
}
