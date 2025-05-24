// hooks
import { useState } from 'react';

// react-native
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// components
import StateTabs, { TabItem } from '@/components/StateTabs';
import FriendsTab from '@/components/Friends/FriendsTab';
import FriendRequestsTab from '@/components/Friends/FriendRequestsTab';
import AddFriendScreen from '@/components/Friends/AddFriendScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TABS: TabItem[] = [
    { key: 'friends', label: 'Friends', icon: 'users' },
    { key: 'requests', label: 'Requests', icon: 'user-plus' }
];



export default function FriendsTabScreen() {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
    const translateX = useSharedValue(0); // 0: friends, 1: requests

    const handleTabChange = (tab: string) => {
        if (tab !== 'friends' && tab !== 'requests') {
            console.error("Invalid tab key");
            return;
        }

        setActiveTab(tab);
        translateX.value = withTiming(tab === 'friends' ? 0 : -SCREEN_WIDTH);
    };

    const slidingTab = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View className="relative flex-1 bg-white p-4 overflow-hidden">
            <StateTabs TABS={TABS} activeTab={activeTab} onChange={handleTabChange} />

            <Animated.View
                style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SCREEN_WIDTH * 2 - 16 * 2,
                }, slidingTab]}
            >
                <View style={{ width: SCREEN_WIDTH - 16 * 2 }}>
                    <FriendsTab />
                </View>
                <View style={{ width: SCREEN_WIDTH - 16 * 2 }}>
                    <FriendRequestsTab />
                </View>
            </Animated.View>

            <AddFriendScreen />
        </View>
    );
}
