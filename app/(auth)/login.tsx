import { useState } from "react";
import { View, Text } from "react-native";
import { Container, Button, TextInButton, Input } from "@/components";
import { Link } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Text>Email</Text>
      <Input value={email} onChangeText={setEmail}></Input>
      <Text>Password</Text>
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      ></Input>
      <Button>
        <TextInButton>Login</TextInButton>
      </Button>
      <Link
        replace
        href="/(auth)/signUp"
        style={{
          marginTop: 25,
          color: "#d46969",
        }}
      >
        Doesn't Have an Account? Sign Up
      </Link>
    </Container>
  );
}
