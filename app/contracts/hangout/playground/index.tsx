import { View, Text } from 'react-native';

export default function PlaygroundPage() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold">Playground</Text>
            <Text className="text-gray-500 mt-2">This is a playground page.</Text>
        </View>
    );
}