import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ViewStyle,
    TextStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabItem {
    name: string;
    icon: keyof typeof Feather.glyphMap;
    label: string;
}

export type { TabItem };

interface SlideTabBarProps extends BottomTabBarProps {
    tabs: TabItem[];
    tabWidth?: number;
    indicatorStyle?: ViewStyle;
    labelStyle?: TextStyle;
}

export function SlideTabBar({
    state,
    descriptors,
    navigation,
    tabs,
    tabWidth = Dimensions.get("window").width / tabs.length,
    labelStyle = {},
}: SlideTabBarProps) {
    const translateX = useSharedValue(0);

    React.useEffect(() => {
        translateX.value = withSpring(state.index * tabWidth, { damping: 10 });
    }, [state.index]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ flexDirection: "row", height: 64, backgroundColor: "#fff", elevation: 8 }}>
            <Animated.View
                style={[{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 4,
                    width: tabWidth,
                    backgroundColor: "#000",
                    borderRadius: 2,
                }, animatedIndicatorStyle]}
            />

            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const { options } = descriptors[route.key];
                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const tab = tabs[index];

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={tab.icon}
                            size={24}
                            color={isFocused ? "#000" : "#aaa"}
                        />
                        <Text style={[{ fontSize: 12, color: isFocused ? "#000" : "#aaa" }, labelStyle]}>
                            {tab.label || options.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
