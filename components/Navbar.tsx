import { Box, Center, Flex, Heading } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Box w="100vw">
            <Center h="10vh">
                <Flex>
                    <Heading fontSize={["xl", "3xl"]}>Lazy</Heading>
                    <Heading fontSize={["xl", "3xl"]} color="red">Watch</Heading>
                </Flex>
            </Center>
        </Box>
    );
}