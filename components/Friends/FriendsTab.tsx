import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

// services
import { getFriends, type Friend } from '@/services/friends';
import FriendCard from '../ProfileCard';

export default function FriendsTab() {
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const fetchFriends = async (): Promise<void> => {
            try {
                const friends = await getFriends();
                setFriends(friends);
            } catch (error) {
                console.error("Error fetching friend list:", error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <View className="py-4">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                    width: '100%'
                }}
                showsVerticalScrollIndicator={false}
            >
                {
                    friends.length > 0 ? (
                        friends.map((friend) => (
                            <FriendCard
                                key={friend.id}
                                name={friend.name}
                                id={friend.id}
                            />
                        ))
                    ) : (
                        <Text className="text-gray-600">No Friends Found</Text>
                    )
                }
            </ScrollView>
        </View>
    );
}