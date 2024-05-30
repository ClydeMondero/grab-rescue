import { Text, View } from "react-native";
import styled from "styled-components/native";

export default function Home() {
  return (
    <Container>
      <Text>Home</Text>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
