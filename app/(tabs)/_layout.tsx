import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home/index" options={{ title: "Home" }} />
            <Tabs.Screen name="friends/index" options={{ title: "Friends" }} />
            <Tabs.Screen name="groups/index" options={{ title: "Groups" }} />
            <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
        </Tabs>
    );
}