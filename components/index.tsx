import styled from "styled-components/native";
import { rgba } from "polished";

export const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.BACKGROUND_COLOR};
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export const Heading = styled.Text`
  color: ${(props) => props.theme.TEXT_COLOR};
  font-weight: bold;
  font-size: 2rem;
`;

export const Input = styled.TextInput`
  color: ${(props) => props.theme.TEXT_COLOR};
  background-color: ${(props) => rgba(props.theme.SECONDARY_COLOR, 0.1)};
  border-radius: 0.6rem;
  box-sizing: border-box;
  padding: 1rem;
  width: 50%;
  height: 50px;
`;

export const FormContainer = styled.View`
  width: 100%;
  align-items: center;
  gap: 1rem;
`;

export const LinkText = styled.Text`
  color: ${(props) => props.theme.ACCENT_COLOR};
  font-weight: 400;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.PRIMARY_COLOR};
  color: ${(props) => props.theme.BACKGROUND_COLOR};
  width: 50%;
  padding: 1rem;
  border-radius: 0.6rem;
`;

export const ButtonText = styled.Text`
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
`;

export const ErrorMessage = styled.Text`
  width: 50%;
  font-weight: 500;
  color: red;
  font-size: 0.8rem;
`;
