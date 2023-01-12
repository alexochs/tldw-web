import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [value, setValue] = useState('')
  const handleChange = (event: any) => setValue(event.target.value)

  return (
    <>
      <Head>
        <title>Too Lazy; Didn&apos;t Watch - YouTube Summary by AI</title>
        <meta name="description" content="Too Lazy; Didn&apos;t Watch - YouTube Summary by AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box w="100vw" h="100vh" flexDir={"column"} fontSize="xl" pt="2rem">
          <Center>
            <Heading fontSize={["5xl", "8xl"]}>
              Too Lazy; 🥱<br/>Didn&apos;t Watch 👀
            </Heading>
          </Center>
          <Center>
            <Text fontSize={["xl", "4xl"]} fontWeight={"normal"}>
              YouTube Summary Database by AI 🤖
            </Text>
          </Center>
          <Box py="1rem"/>
          <Center>
            <Stack w={["95vw", "36rem"]} px="2.5vw">
              <Input
                value={value}
                onChange={handleChange}
                placeholder='Paste a YouTube URL in here and we&apos;ll do the magic! ✨'
                size='lg'
                colorScheme={"red"}
                variant="filled"
                rounded="2xl"
                fontSize={["md", "xl"]}
                maxW="36rem"
                py="1rem"
              />
              <Button colorScheme={"red"} size="lg" rounded="2xl" disabled fontSize={["2xl", "3xl"]} p="2rem">
                Out of Juice 🥤
              </Button>
            </Stack>
          </Center>
          <Box py="2rem"/>
          <Center>
            <Stack w={["95vw", "36rem"]} px="2.5vw">
              <Heading fontSize={["3xl", "5xl"]}>TL;DW 2 GO 🏃‍♂️</Heading>
              <Text fontSize={["lg", "2xl"]}>Download the Chrome extension for summaries on the go, directly on YouTube!</Text>
              <Button colorScheme={"red"} size="lg" rounded="2xl" disabled fontSize={["2xl", "3xl"]} p="2rem">
                Coming soon 🚧
              </Button>
            </Stack>
          </Center>
        </Box>
        <Center py="1rem">
          <Link href="https://alexochs.de" target="_blank">
            <Text fontSize={["xs", "md"]}>Made with ❤️ by <b>Alex Ochs - Web & Software Developer 👨🏻‍💻</b></Text>
          </Link>
        </Center>
      </main>
    </>
  )
}
