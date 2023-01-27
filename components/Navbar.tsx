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
                <Flex>
                    <Heading fontSize={["xl", "3xl"]}>Too Lazy</Heading>
                    <Heading fontSize={["xl", "3xl"]} color="red">;&nbsp;</Heading>
                    <Heading fontSize={["xl", "3xl"]}>Didn&apos;t Watch</Heading>
                </Flex>
            </Center>
        </Box>
    );
}