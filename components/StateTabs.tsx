import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

import { useEffect, useState, useCallback } from 'react';

export type TabItem = {
    key: string;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

export default function StateTabs({
    TABS,
    activeTab,
    onChange,
}: {
    TABS: TabItem[];
    activeTab: string;
    onChange: (tab: string) => void;
}) {
    const translateX = useSharedValue(0);
    const index = TABS.findIndex((tab) => tab.key === activeTab);
    
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const tabWidth = containerWidth / TABS.length;

    const onContainerLayout = useCallback((event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
    }, []);
    
    useEffect(() => {
        translateX.value = withSpring(index * tabWidth, { damping: 20 });
    }, [index, tabWidth]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View className="flex-row bg-gray-100 p-1 rounded-full mb-4" onLayout={onContainerLayout}>
            <Animated.View
                style={[{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    height: containerHeight - 16,
                    width: tabWidth - 16,
                    marginHorizontal: 8,
                    borderRadius: 12,
                    backgroundColor: "#D3D3D3",
                    zIndex: 0,
                }, animatedIndicatorStyle]}
            />

            {TABS.map((tab) => {
                const isActive = tab.key === activeTab;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onChange(tab.key)}
                        className={`flex-1 px-4 py-2 rounded-full flex-row items-center justify-center w-[${tabWidth}px]`}
                    >
                        <Feather
                            name={tab.icon}
                            size={16}
                            color={isActive ? 'black' : 'gray'}
                        />
                        <Text 
                            className={`ml-1 font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
