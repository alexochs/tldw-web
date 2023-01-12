import { Box, Button, Center, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExtensionPage() {
    const router = useRouter();
    const session = useSession()
    const supabase = useSupabaseClient()

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }

        const localStorageUserId = localStorage.getItem("tldwUserId");
        if (!localStorageUserId && localStorageUserId !== session.user.id) {
            localStorage.setItem("tldwUserId", session.user.id);
            console.log("Saved user ID into local storage!");
            router.reload();
        }
    }, [session]);

    function NotAuthenticated() {
        return (
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
        )
    }

    function Authenticated() {
        return (
            <Center flexDir={"column"}>
                <Stack spacing="1rem">
                    <Heading>You&apos;re logged in 👋</Heading>
                    <Text fontSize="2xl">But we&apos;re still working here 👷‍♂️</Text>
                    <Button onClick={() => router.push("/")} fontSize="5xl" py="2rem" px="1rem" colorScheme={"yellow"} rounded="2xl">🔙</Button>
                </Stack>
            </Center>
        );
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
              <Text fontSize={["sm", "3xl"]} fontWeight={"normal"} pl="1rem" pr="2rem">
                A database of YouTube summaries made by AI 🤖
              </Text>
            </Center>
          </Link>
          <Box py="1rem"/>
          <Center>
            <Stack w={["95vw", "36rem"]} px="2.5vw">
                {session && session.user ? <Authenticated /> : <NotAuthenticated />}
            </Stack>
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