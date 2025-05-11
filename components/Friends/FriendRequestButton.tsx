import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function FriendRequestButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="absolute bottom-5 right-5 bg-blue-500 p-4 rounded-full shadow-lg"
        >
            <Feather name="user-plus" size={24} color="white" />
        </TouchableOpacity>
    );
}