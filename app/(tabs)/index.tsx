import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Text, Button, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //Get Location
  const getLocation = async () => {
    setIsLoading(true);

    // Ask for permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setIsLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setIsLoading(false);
  };

  useEffect(() => {
    getLocation();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>{text}</Text>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
