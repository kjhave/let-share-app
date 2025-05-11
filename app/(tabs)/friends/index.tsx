import { useState } from 'react';
import { View } from 'react-native';
import StateTabs, { TabItem } from '@/components/StateTabs';
import FriendCard from '@/components/Friends/FriendCard';
import FriendRequests from '@/components/Friends/FriendRequests';
import Animated, {
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';

const TABS: TabItem[] = [
    { key: 'friends', label: 'Friends', icon: 'users' },
    { key: 'requests', label: 'Requests', icon: 'user-plus' }
];

export default function FriendsTabScreen() {
    const [activeTab, setActiveTab] = useState<string>('friends');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <View className="flex-1 bg-white p-4">
            <StateTabs TABS={TABS} activeTab={activeTab} onChange={handleTabChange} />

            {activeTab === 'friends' ? (
                <Animated.View
                    key="friends"
                >
                    <FriendCard name="Kjhave" id="u123" />
                    <FriendCard name="Kale" id="u124" />
                </Animated.View>
            ) : (
                <Animated.View
                    key="requests"
                >
                    <FriendRequests />
                </Animated.View>
            )}
        </View>
    );
}
