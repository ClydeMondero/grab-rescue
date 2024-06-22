import { useState } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "@/constants/themes";
import "@/firebaseConfig";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function RootLayout() {
  const { user } = useAuthentication();
  const [theme, setTheme] = useState("light");

  //TODO: Add Toggle for theme

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Stack>
        user ?
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        :
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
