import { Box, Center, Flex, Heading, Link, Text } from "@chakra-ui/react";

export default function Footer() {
    return (
        <Center pt="4rem" pb="1rem">
          <Link href="https://alexochs.de" target="_blank">
            <Text fontSize={["xs", "md"]}>Made with ❤️ by <b>Alex Ochs - Web & Software Developer 👨🏻‍💻</b></Text>
          </Link>
        </Center>
    );
}