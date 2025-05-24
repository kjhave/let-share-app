import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function PressableButton({
    title,
    onPress,
}:{
    title: string,
    onPress: () => void,
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
        console.log(title, "button has pressed");
        onPress();
    }

    return(
        <Pressable
            className="bg-gray-200 py-3 px-4 rounded-xl items-center"
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
                <Text className="text-gray-800 font-medium">{title}</Text>
            </Animated.View>
        </Pressable>
    );
}