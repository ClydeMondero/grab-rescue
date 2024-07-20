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
import { userRegistrationSchema, UserRegistration } from "@/constants/types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(userRegistrationSchema),
  });

  const onSubmit = (data: UserRegistration) => {
    console.log("Success", JSON.stringify(data));
  };
  return (
    <Container>
      <Heading>Register as Rescuer</Heading>
      <FormContainer>
        <FormInput control={control} name="email" placeholder="Email" />
        <FormInput control={control} name="fullName" placeholder="Full Name" />
        <FormInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry={true}
        />
        <FormInput
          control={control}
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
      </FormContainer>
      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Register</ButtonText>
      </Button>
      <Link href="/(auth)/" asChild>
        <LinkText>Already Have an Account? Login Now.</LinkText>
      </Link>
    </Container>
  );
}
