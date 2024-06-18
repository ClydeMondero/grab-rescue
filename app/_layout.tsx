import { useState } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "@/constants/themes";

export default function RootLayout() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
