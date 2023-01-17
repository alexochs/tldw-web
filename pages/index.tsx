import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Flex, Heading, HStack, Input, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

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
        <Box w="100vw" minH="100vh" flexDir={"column"} fontSize="xl" pt="2rem" bg="rgb(232, 220, 202)">
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
          <Box py="1rem"/>
          <Center>
            <Stack w={["95vw", "48rem"]} px="2.5vw">
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
              {/*<HStack>
                <Button w="full" isDisabled={loading} colorScheme={"yellow"} size="lg" rounded="2xl" fontSize={["2xl", "3xl"]} p="2rem" onClick={() => {router.push("/login");}}>
                  Login ➡️
                </Button>
                <Button w="full" isDisabled={true} colorScheme={"blue"} size="lg" rounded="2xl" fontSize={["2xl", "3xl"]} p="2rem" onClick={() => {router.push("/summaries");}}>
                  Browse 🔜
                </Button>
              </HStack>*/}
            </Stack>
          </Center>
          <Box py="4rem"/>
          <Center>
            <Stack w={["95vw", "36rem"]} px="2.5vw">
              <Heading fontSize={["3xl", "5xl"]}>TL;DW 2 GO 🏃‍♂️</Heading>
              <Text fontSize={["lg", "2xl"]}>Download the Chrome extension for summaries on the go, directly on YouTube 👇</Text>
              <Button colorScheme={"red"} size="lg" rounded="full" disabled fontSize={["2xl", "3xl"]} p="2rem">
                Coming soon 🚧
              </Button>
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
