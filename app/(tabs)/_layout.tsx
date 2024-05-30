import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon(props) {
            return <Ionicons name="home" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tips",
          tabBarIcon(props) {
            return <Ionicons name="bulb" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="hotlines"
        options={{
          title: "Hotlines",
          tabBarIcon(props) {
            return <Ionicons name="call" {...props} />;
          },
        }}
      />
    </Tabs>
  );
}
