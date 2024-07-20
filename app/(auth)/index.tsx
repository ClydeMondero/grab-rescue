import { useState } from "react";
import { Text } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { rgba } from "polished";
import { Controller, useForm } from "react-hook-form";
import { UserLogin } from "@/constants/types";

export default function Index() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: UserLogin) => {
    console.log("Success", JSON.stringify(data));
  };

  return (
    <Container>
      <Heading>Login as Rescuer</Heading>
      <InputContainer>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Full Name"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            ></Input>
          )}
        />
        <PasswordContainer>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                placeholder="Password"
                secureTextEntry={true}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              ></PasswordInput>
            )}
          />
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
      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Login</ButtonText>
      </Button>
    </Container>
  );
}
