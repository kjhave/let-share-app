import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function PressableButton({
    title,
    onPress,
    bgColor = "#e5e7eb",
    textColor = "#1f2937",
    borderColor = "",
    padding = { y: 12, x: 16 },
    primary = false,
}:{
    title: string,
    onPress: () => void,
    bgColor?: string,
    textColor?: string,
    borderColor?: string,
    padding?: { y: number, x: number }
    primary?: boolean,
}){
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    const handlePress = () => {
        // console.log(title, "button has pressed");
        onPress();
    }

    return(
        <Pressable
            className="bg-gray-200 w-full rounded-xl items-center"
            style={{
                borderColor: borderColor || "transparent",
                borderWidth: borderColor ? 1 : 0,
                backgroundColor: bgColor,
                paddingVertical: padding.y,
                paddingHorizontal: padding.x,
            }}
            onPress={handlePress}
            onPressIn={() => {
                scale.value = withTiming(0.95, { duration: 100 });
                opacity.value = withTiming(0.7, { duration: 100 });
            }}
            onPressOut={() => {
                scale.value = withTiming(1, { duration: 150 });
                opacity.value = withTiming(1, { duration: 150 });
            }}
        >
            <Animated.View style={animatedStyle}>
                <Text className={primary?"font-semibold":"font-medium"} style={{ color: textColor }}>{title}</Text>
            </Animated.View>
        </Pressable>
    );
}