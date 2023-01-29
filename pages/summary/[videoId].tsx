import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Center, Heading, Input, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
            channel: data.items[0].snippet.channelTitle,
        }
    }
}

export default function SummaryPage({videoId, title, channel, error}: any) {
    const router = useRouter();

    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        if (error) {
            router.push("/");
            return;
        }

        summarize(videoId, title, channel);
    }, []);

    async function summarize(videoId: string, title: string, channel: string) {
        const response = await fetch("https://lazywatch.app/api/summarize?videoId=" + videoId + "&title=" + title.replaceAll(" ", "%20%") + "&channel=" + channel.replaceAll(" ", "%20%") + "&userId=644e9b54-f467-4fca-bbe5-546efa86c972");
        if (response.status != 200) {
            setSummary({message: "Something went wrong 🤔\nMake sure the video has english subtitles."});
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
                <Box>
                    <Navbar/>

                    <Center flexDir="column" pt="4rem">
                        <Link href={`https://youtube.com/watch?v=${videoId}`} target="_blank">
                            <Heading maxW={["90vw", "50vw"]} textAlign={"center"}>{title}</Heading>
                        </Link>
                        <Box py="0.5rem"/>
                        {summary && <Text fontSize="md">0:00 - {Math.floor(summary.lastTimestamp / 60)}:{summary.lastTimestamp % 60}</Text>}
                        {error ? <Text fontSize={["3xl", "4xl"]} fontWeight="bold">{error}</Text> : summary ? 
                        <Text fontSize="lg" maxW={["90vw", "50vw"]} textAlign="justify">{summary.message}</Text> : <Spinner size="xl"/>}
                    </Center>

                    {summary && <Center pt={["8rem", "8rem"]}>
                        <Button fontSize="xl" rounded="full" colorScheme={"red"} onClick={() => router.push("/")}>ANOTHER ONE ☝️</Button>
                    </Center>}
                    
                    <Footer/>
                </Box>
            </main>
        </>
    )
}