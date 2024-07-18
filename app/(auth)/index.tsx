import { useState } from "react";
import {
  Container,
  Heading,
  InputContainer,
  Input,
  PasswordContainer,
  PasswordInput,
  LinkText,
  Button,
} from "@/components";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { rgba } from "polished";

export default function Index() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Heading>Login as Rescuer</Heading>
      <InputContainer>
        <Input placeholder="Email"></Input>
        <Input placeholder="Full Name"></Input>
        <PasswordContainer>
          <PasswordInput
            placeholder="Password"
            secureTextEntry={true}
          ></PasswordInput>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            color={rgba(theme.SECONDARY_COLOR, 0.5)}
            size={20}
            onPress={toggleShowPassword}
          />
        </PasswordContainer>
      </InputContainer>
      <Link href="/(auth)/register" asChild>
        <LinkText>Don't Have an Account? Register Now.</LinkText>
      </Link>
      <Button>Login</Button>
    </Container>
  );
}
