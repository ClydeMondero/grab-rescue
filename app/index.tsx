import { StyleSheet, View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Container } from "@/components";
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
        href="/(auth)"
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

const Title = styled.Text`
  font-size: 5rem;
`;

const Button = styled.Pressable`
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.PRIMARY_COLOR};
`;

const TextInButton = styled.Text`
  color: ${(props) => props.theme.TEXT_COLOR};
  font-weight: 600;
`;
