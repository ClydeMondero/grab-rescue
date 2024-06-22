import { StyleSheet, View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Container, Title, Button, TextInButton } from "@/components";
import styled from "styled-components/native";

export default function Welcome() {
  return (
    <Container>
      <Title>Welcome!</Title>
      <Link replace href="/(tabs)" asChild>
        <Button>
          <TextInButton>Continue</TextInButton>
        </Button>
      </Link>
      <Link
        replace
        href="/(auth)/login"
        style={{
          marginTop: 25,
          color: "#d46969",
        }}
      >
        Login as Admin
      </Link>
    </Container>
  );
}
