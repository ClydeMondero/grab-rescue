import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Text, Button, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Container } from "@/components";

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

  //Get Location once
  useEffect(() => {
    getLocation();
  }, []);

  //Update Text
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <Container>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>{text}</Text>
        </>
      ) : location ? (
        //TODO: Enable Google Maps
        // <MapView
        //   provider={PROVIDER_GOOGLE}
        //   initialRegion={{
        //     latitude: location.coords.latitude,
        //     longitude: location.coords.longitude,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        //   }}
        // >
        //   <Marker
        //     coordinate={{
        //       latitude: location.coords.latitude,
        //       longitude: location.coords.longitude,
        //     }}
        //     title="You are here"
        //   />
        // </MapView>
        <Text>{text}</Text>
      ) : (
        <Text>{text}</Text>
      )}
    </Container>
  );
}
