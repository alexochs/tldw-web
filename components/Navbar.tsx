import { Box, Center, Flex, Heading } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Box w="100vw">
            <Center h="10vh">
                {/*<Flex>
                    <Heading fontSize={["xl", "3xl"]}>lazywatch</Heading>
                    <Heading fontSize={["xl", "3xl"]} color="red">.</Heading>
                    <Heading fontSize={["xl", "3xl"]}>ai</Heading>
    </Flex>*/}
                    <Heading fontSize={["xl", "3xl"]}>Lazy<span color="red">Watch</span></Heading>
            </Center>
        </Box>
    );
}