import styled from "styled-components/native";

export const Button = styled.Pressable`
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.PRIMARY_COLOR};
`;
