import { Text } from "react-native";
import { Container } from "@/components";
import { Link } from "expo-router";

export default function Register() {
  return (
    <Container>
      <Text>Login</Text>
      <Link href="/(auth)/register" asChild>
        <Text>Don't Have an Account? Register Now.</Text>
      </Link>
    </Container>
  );
}
