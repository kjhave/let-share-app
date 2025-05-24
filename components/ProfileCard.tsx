import React from 'react';
import { Text, Pressable } from 'react-native';

interface ProfileCardProps {
    name: string;
    id: string;
}

export default function ProfileCard({ name, id }: ProfileCardProps) {
    const onPress = () => {
        //show popup
        console.log("profile pressed:", name, id);
    }

    return (
        <Pressable
            onPress={onPress}
            className="bg-white p-4 rounded-2xl mb-3 -mx-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 6,
            }}
        >
            <Text className="text-lg font-semibold max-w-full">{name}</Text>
            <Text className="text-sm text-gray-500 max-w-full">ID: {id}</Text>
        </Pressable>
    );
}
