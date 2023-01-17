import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Heading, Input, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: any) {
    const { videoId } = context.params;

    const response = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + "AIzaSyDTE6cLA6Bbd0Z4kGVKUTXwke90lYHCIgo");
    const data = await response.json();
    if (!data || !data.items || data.items.length == 0) {
        return {
            props: {
                error: "Stop messing around 🥸"
            }
        }
    }

    return {
        props: {
            videoId: videoId,
            title: data.items[0].snippet.title,
        }
    }
}

export default function SummaryPage({videoId, title, error}: any) {
    const router = useRouter();

    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        if (error) {
            router.push("/");
            return;
        }

        summarize(videoId, title);
    }, []);

    async function summarize(videoId: string, title: string) {
        const response = await fetch("http://tldw.alexochs.de/api/summarize?videoId=" + videoId + "&title=" + title.replaceAll(" ", "%20%") + "&userId=644e9b54-f467-4fca-bbe5-546efa86c972");
        if (response.status != 200) {
            setSummary({message: "Something went wrong 🤔. Make sure the video has english."});
            return;
        }

        setSummary(await response.json());
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
                <Box py={["1rem", "2rem"]}/>
                <Center flexDir="column">
                    <Heading>{title}</Heading>
                    <Box py="0.5rem"/>
                    {error ? <Text fontSize={["3xl", "4xl"]} fontWeight="bold">{error}</Text> : summary ? 
                    <Text px="4rem">{summary.message}</Text> : <Spinner size="xl"/>}
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