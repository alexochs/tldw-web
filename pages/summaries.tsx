import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Flex, Heading, HStack, Input, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [url, setUrl] = useState('')
  const handleChange = (event: any) => setUrl(event.target.url)

  function goToSummary() {
    setLoading(true);
    if (url === "" || url === undefined || !url.includes("youtube.com/watch?v=")) {
      setLoading(false);
      setInvalidUrl(true);
      return;
    }
    setInvalidUrl(false);
    router.push("/summary?url=" + url);
  }

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
          <Center>
            <Heading fontSize={["5xl", "8xl"]}>
              Too Lazy; 🥱<br/>Didn&apos;t Watch 👀
            </Heading>
          </Center>
          <Center>
            <Text fontSize={["sm", "3xl"]} fontWeight={"normal"} pl="1rem" pr="2rem">
              YouTube summaries made by AI 🤖
            </Text>
          </Center>
          <Box py="1rem"/>
          <Center>
            <Stack w={["95vw", "48rem"]} px="2.5vw">
              <Heading>Title</Heading>
              <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, necessitatibus aliquid assumenda repellat molestias unde? Nihil eligendi laudantium pariatur ad provident quidem quos odio, impedit hic accusamus repudiandae blanditiis dolores!</Text>
            </Stack>
          </Center>
        </Box>
        <Center pt="4rem" pb="1rem"  bg="rgb(232, 220, 202)">
          <Link href="https://alexochs.de" target="_blank">
            <Text fontSize={["xs", "md"]}>Made with ❤️ by <b>Alex Ochs - Web & Software Developer 👨🏻‍💻</b></Text>
          </Link>
        </Center>
      </main>
    </>
  )
}
