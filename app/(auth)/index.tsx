import {
  Container,
  Heading,
  FormContainer,
  LinkText,
  Button,
  ButtonText,
} from "@/components";
import FormInput from "@/components/FormInput";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { UserLogin, userLoginSchema } from "@/constants/types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Index() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = (data: UserLogin) => {
    console.log("Success", JSON.stringify(data));
  };

  return (
    <Container>
      <Heading>Login as Rescuer</Heading>
      <FormContainer>
        <FormInput control={control} name="email" placeholder="Email" />
        <FormInput control={control} name="fullName" placeholder="Full Name" />
        <FormInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry={true}
        />
      </FormContainer>
      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Login</ButtonText>
      </Button>
      <Link href="/(auth)/register" asChild>
        <LinkText>Don't Have an Account? Register Now.</LinkText>
      </Link>
    </Container>
  );
}
