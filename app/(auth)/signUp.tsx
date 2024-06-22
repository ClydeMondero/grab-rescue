import { useState } from "react";
import { View, Text } from "react-native";
import { Container, Button, TextInButton, Input } from "@/components";
import { Link } from "expo-router";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Container>
      <Text>Username</Text>
      <Input value={username} onChangeText={setUsername}></Input>
      <Text>Email</Text>
      <Input value={email} onChangeText={setEmail}></Input>
      <Text>Password</Text>
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      ></Input>
      <Text>Confirm Password</Text>
      <Input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      ></Input>
      <Button>
        <TextInButton>Sign Up</TextInButton>
      </Button>
      <Link
        replace
        href="/(auth)/login"
        style={{
          marginTop: 25,
          color: "#d46969",
        }}
      >
        Already have an account? Login
      </Link>
    </Container>
  );
}
