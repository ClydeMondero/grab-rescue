import styled from "styled-components/native";
import Constants from "expo-constants";

export const Container = styled.View`
  background-color: ${(props) => props.theme.PRIMARY_COLOR};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: ${Constants.statusBarHeight + "px"};
`;
