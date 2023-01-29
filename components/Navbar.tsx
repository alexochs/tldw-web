import { Box, Center, Flex, Heading } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Box w="100vw">
            <Center h="10vh">
                <Heading fontSize={["xl", "3xl"]}>🥱 LazyWatch</Heading>
            </Center>
        </Box>
    );
}