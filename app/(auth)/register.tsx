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
  ButtonText,
} from "@/components";
import { Link } from "expo-router";
import { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { rgba } from "polished";

export default function Register() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Container>
      <Heading>Register as Rescuer</Heading>
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
        <PasswordContainer>
          <PasswordInput
            placeholder="Confirm Password"
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
      <Link href="/(auth)/" asChild>
        <LinkText>Already Have an Account? Login Now.</LinkText>
      </Link>
      <Button>
        <ButtonText>Register</ButtonText>
      </Button>
    </Container>
  );
}
