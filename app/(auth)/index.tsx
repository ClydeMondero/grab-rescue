import {
  Container,
  Heading,
  InputContainer,
  Input,
  LinkText,
  Button,
} from "@/components";
import { Link } from "expo-router";

export default function Index() {
  return (
    <Container>
      <Heading>Login as Rescuer</Heading>
      <InputContainer>
        <Input placeholder="Email"></Input>
        <Input placeholder="Full Name"></Input>
        <Input placeholder="Password"></Input>
      </InputContainer>
      <Link href="/(auth)/register" asChild>
        <LinkText>Don't Have an Account? Register Now.</LinkText>
      </Link>
      <Button>Login</Button>
    </Container>
  );
}
