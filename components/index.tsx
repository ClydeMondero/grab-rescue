import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.BACKGROUND_COLOR};
  flex: 1;
  align-items: center;
  justify-content: center;
`;
