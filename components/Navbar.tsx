import { Box, Center, Flex, Heading, Link } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Box w="100vw">
            <Center h="10vh">
                <Link href="/">
                    <Heading fontSize={["xl", "3xl"]}>🥱 LazyWatch</Heading>
                </Link>
            </Center>
        </Box>
    );
}