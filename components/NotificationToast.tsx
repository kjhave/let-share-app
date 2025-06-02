import React, { useEffect } from 'react';
import { Text, Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
} from 'react-native-reanimated';

interface NotificationToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
    duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 3000,
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-40);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });

        translateY.value = withDelay(
            duration,
            withTiming(-20, { duration: 400 }, () => {
                opacity.value = withTiming(0, { duration: 300 }, () => {
                    if (onClose) runOnJS(onClose)();
                });
            })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const getColor = () => {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            default: return '#0D3B66';
        }
    };

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 50,
                    left: 20,
                    right: 20,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: getColor(),
                    zIndex: 999,
                    elevation: 999,
                },
                animatedStyle,
            ]}
        >
            <Pressable onPress={onClose}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                    {message}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

export default NotificationToast;