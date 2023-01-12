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
            <Box>
                <Text>Authenicated!</Text>
                <Button onClick={supabase.auth.signOut}>Logout</Button>
            </Box>
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
        <Box w="100vw" flexDir={"column"} fontSize="xl" pt="rem">
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
            <Center flexDir={"column"} h="360px">
                <Stack w={["95vw", "36rem"]} px="2.5vw">
                    {session && session.user ? <Authenticated/> : <NotAuthenticated/>}
                </Stack>
            </Center>
        </Box>
        <Center py="1rem">
            <Link href="https://alexochs.de" target="_blank">
            <Text fontSize={"xs"}>Made with ❤️ by <b>Alex Ochs - Web & Software Developer 👨🏻‍💻</b></Text>
            </Link>
        </Center>
      </main>
    </>
  )
}