import { useState } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function RootLayout() {
    const [theme, setTheme] = useState("light"); //create theme state

    const user = useAuthentication(); //get the user auth status

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            user ?
            <Stack>
                <Stack.Screen name="(rescuer)" options={{ headerShown: false }} />
            </Stack>
            :
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
        </ThemeProvider>
    );
}
