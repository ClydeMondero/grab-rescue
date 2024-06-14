import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon(props) {
            return (
              <Ionicons
                name="home"
                color={props.focused ? theme.PRIMARY_COLOR : props.color}
                size={props.size}
              />
            );
          },
          tabBarActiveTintColor: theme.PRIMARY_COLOR,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tips",
          tabBarIcon(props) {
            return (
              <Ionicons
                name="bulb"
                color={props.focused ? theme.PRIMARY_COLOR : props.color}
                size={props.size}
              />
            );
          },
          tabBarActiveTintColor: theme.PRIMARY_COLOR,
        }}
      />
      <Tabs.Screen
        name="hotlines"
        options={{
          title: "Hotlines",
          tabBarIcon(props) {
            return (
              <Ionicons
                name="call"
                color={props.focused ? theme.PRIMARY_COLOR : props.color}
                size={props.size}
              />
            );
          },
          tabBarActiveTintColor: theme.PRIMARY_COLOR,
        }}
      />
    </Tabs>
  );
}
