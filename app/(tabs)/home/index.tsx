import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function HomeTabScreen() {
    const user = {
        name: 'Khanh',
        id: 'u197'
    };

    const scaleCreateContract = useSharedValue(1);
    const opacityCreateContract = useSharedValue(1);
    const animatedCreateContractStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleCreateContract.value }],
            opacity: opacityCreateContract.value,
        };
    });

    const scaleFinancial = useSharedValue(1);
    const opacityFinancial = useSharedValue(1);
    const animatedFinancialStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleFinancial.value }],
            opacity: opacityFinancial.value,
        };
    });

    return (
        <View className="flex-1 bg-white p-4">
            {/* Header section */}
            <View className="bg-[#0D3B66] rounded-xl p-6 mb-8 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-[#FFFFFF]">Let Share</Text>
                <View className="items-end">
                    <Text className="text-lg text-[#FFFFFF] font-semibold">{user.name}</Text>
                    <Text className="text-sm text-[#B0CDEB]">#{user.id}</Text>
                </View>
            </View>

            {/* Body section */}
            <View className="flex gap-4 space-y-4">
                <Pressable
                    className="bg-gray-200 py-3 px-4 rounded-xl items-center"
                    onPress={() => {console.log('Create New Contract')}}
                    onPressIn={() => {
                        scaleCreateContract.value = withTiming(0.95, { duration: 100 });
                        opacityCreateContract.value = withTiming(0.7, { duration: 100 });
                    }}
                    onPressOut={() => {
                        scaleCreateContract.value = withTiming(1, { duration: 150 });
                        opacityCreateContract.value = withTiming(1, { duration: 150 });
                    }}
                >
                    <Animated.View style={animatedCreateContractStyle}>
                        <Text className="text-gray-800 font-medium">Create New Contract</Text>
                    </Animated.View>
                </Pressable>

                <Pressable
                    className="bg-gray-200 py-3 px-4 rounded-xl items-center hover:bg-gray-300"
                    onPress={() => {console.log('Show Financial Relationships')}}
                    onPressIn={() => {
                        scaleFinancial.value = withTiming(0.95, { duration: 100 });
                        opacityFinancial.value = withTiming(0.7, { duration: 100 });
                    }}
                    onPressOut={() => {
                        scaleFinancial.value = withTiming(1, { duration: 150 });
                        opacityFinancial.value = withTiming(1, { duration: 150 });
                    }}
                >
                    <Animated.View style={animatedFinancialStyle}>
                        <Text className="text-gray-800 font-medium">Show Financial Relationships</Text>
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    );
}
