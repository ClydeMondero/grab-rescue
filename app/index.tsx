import { Text } from "react-native";
import { Container } from "@/components";
import { Link } from "expo-router";
import "@/api/firebaseConfig";

export default function Index() {
    return (
        <Container>
            <Link href="/(auth)" asChild>
                <Text>Continue as Rescuer</Text>
            </Link>
        </Container>
    );
}
