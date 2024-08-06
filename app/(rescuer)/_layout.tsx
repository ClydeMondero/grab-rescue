import { Stack } from "expo-router";

export default function RescuerLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Rescuer Page" }} />
        </Stack>
    )
}
