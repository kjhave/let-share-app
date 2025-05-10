import { Tabs } from "expo-router";
import { SlideTabBar, type TabItem } from "@/components/SlideTabBar";

const tabItems: TabItem[] = [
    { name: "home/index", icon: "home", label: "Home" },
    { name: "friends/index", icon: "users", label: "Friends" },
    { name: "groups/index", icon: "layers", label: "Groups" },
    { name: "profile/index", icon: "user", label: "Profile" },
];

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <SlideTabBar {...props} tabs={tabItems} />}
            screenOptions={{
                headerShown: false,
                animation: "fade"
            }}
        >
            {tabItems.map((item) => (
                <Tabs.Screen key={item.name} name={item.name} options={{ title: item.label }} />
            ))}
        </Tabs>
    );
}
