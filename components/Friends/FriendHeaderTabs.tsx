// components/friends/FriendsHeaderTabs.tsx
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
// import { Motion } from 'framer-motion';
// import { useState } from 'react';

export type FriendSubTab = 'friends' | 'requests';

type TabItem = {
    key: FriendSubTab;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

const TABS: TabItem[] = [
    { key: 'friends', label: 'Friends', icon: 'users' },
    { key: 'requests', label: 'Requests', icon: 'user-plus' }
];

export default function FriendsHeaderTabs({
    activeTab,
    onChange
}: {
    activeTab: FriendSubTab;
    onChange: (tab: FriendSubTab) => void;
}) {
    return (
        <View className="flex-row bg-gray-100 p-1 rounded-full mb-4">
            {TABS.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onChange(tab.key)}
                        className={`flex-1 px-4 py-2 rounded-full flex-row items-center justify-center ${
                            isActive ? 'bg-white shadow-md' : ''
                        }`}
                    >
                        <Feather
                            name={tab.icon}
                            size={16}
                            color={isActive ? 'black' : 'gray'}
                        />
                        <Text className={`ml-1 font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
