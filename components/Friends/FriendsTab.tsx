import { View, Text, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';

// services
import { getFriends, type Friend } from '@/services/friends';
import FriendCard from '../ProfileCard';

export default function FriendsTab() {
    const [friends, setFriends] = useState<Friend[]>([]);

    const fetchFriends = async (): Promise<void> => {
        try {
            const friends = await getFriends();
            setFriends(friends);
        } catch (error) {
            console.error("Error fetching friend list:", error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <View className="py-4">
            <View className="w-full flex items-end" >
                <Pressable
                    onPress={fetchFriends}
                    className="rounded-full z-20 bg-gray-100"
                >
                    <Feather name="repeat" size={20} color="#333" />
                </Pressable>
            </View>

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