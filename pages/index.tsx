import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Flex, Heading, HStack, Input, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [url, setUrl] = useState('')
  const handleChange = (event: any) => setUrl(event.target.value)

  function youtube_parser(url: any){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  function goToSummary() {
    setLoading(true);

    const videoId = youtube_parser(url);

    if (url === "" || url === undefined || !url.includes("youtube.com/watch?v=") || !videoId) {
      if (url === "" || url === undefined) {
        setErrorMessage("Where's the URL you dummy? 🤦🏻‍♂️");
      } else if (!url.includes("youtube.com/watch?v=") || !videoId) {
        setErrorMessage("That URL doesn't seem valid 😅");
      }

      setLoading(false);
      setInvalidUrl(true);
      return;
    }

    setInvalidUrl(false);
    router.push("/summary/" + videoId);
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
        <Box>
          <Navbar/>

          <Heading textAlign={"center"} fontSize={["4xl", "7xl"]} pt="4rem" px="10vw">
            <span style={{color: "red"}}>Maximize</span> your productivity.<br/><span style={{color: "red"}}>Waste less</span> time.
          </Heading>

          <Center pt="2rem">
            <Stack w={["95vw", "48rem"]} px="2.5vw">
              <Center>
                <Text fontWeight={"bold"} fontSize={["2xl", "4xl"]}>Give it a try 👇</Text>
              </Center>
              <Input
                isInvalid={invalidUrl}
                value={url}
                onChange={handleChange}
                placeholder='Paste a YouTube URL in here and we&apos;ll do the magic! ✨'
                size='lg'
                colorScheme={"red"}
                variant="filled"
                rounded="full"
                fontSize={["md", "xl"]}
                maxW={["36rem", "80vw"]}
                py="1rem"
              />
              <Button isLoading={loading} colorScheme={"red"} size="lg" rounded="full" fontSize={["2xl", "3xl"]} p="2rem" onClick={goToSummary}>
                Sum it up! 😎
              </Button>
              <Center>
                <Text fontSize={["md", "lg"]} color="red.600">{errorMessage}</Text>
              </Center>
            </Stack>
          </Center>

          <Center pt="8rem">
            <Text>Chrome Extension coming soon...</Text>
          </Center>

          <Footer/>
        </Box>
      </main>
    </>
  )
}
