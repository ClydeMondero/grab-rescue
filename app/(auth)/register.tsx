import { Text } from "react-native";
import { Container } from "@/components";
import { Link } from "expo-router";

export default function Register() {
  return (
    <Container>
      <Text>Register</Text>
      <Link href="/(auth)/register" asChild>
        <Text>Already Have an Account? Login Now.</Text>
      </Link>
    </Container>
  );
}
