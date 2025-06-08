import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext';

// services
import { acceptFriendRequest, denyFriendRequest, getFriendRequests, type FriendRequest } from '@/services/friends';
import FriendRequestCard from './FriendRequestCard';

export default function FriendRequestsTabs() {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const { showToast } = useToast();
    
    useEffect(() => {
        const fetchFriendRequests = async (): Promise<void> => {
            try {
                const friendRequests = await getFriendRequests();
                setFriendRequests(friendRequests);
            } catch (error) {
                console.error("Error fetching friend request list:", error);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleAccept = async (friendId: string) => {
        try {
            await acceptFriendRequest(friendId);

            showToast("Friend request accepted", { title: "Friend Request", type: 'success' });
        }
        catch(error){
            showToast("Failed to accept friend request", { title: "Friend Request", type: 'error' });
            console.log("Error when accept friend request", error);
        }
    }

    const handleDeny = async (friendId: string) => {
        try {
            await denyFriendRequest(friendId);

            showToast("Friend request denied", { title: "Friend Request", type: 'success' });
        }
        catch(error){
            showToast("Failed to deny friend request", { title: "Friend Request", type: 'error' });
            console.log("Error when deny friend request", error);
        }
    }

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
                    friendRequests.length > 0 ? (
                        friendRequests.map((friend) => (
                            <FriendRequestCard
                                key={friend.id}
                                name={friend.name}
                                id={friend.id}
                                onAccept={handleAccept}
                                onDeny={handleDeny}
                            />
                        ))
                    ) : (
                        <Text className="text-gray-600">No Friend Requests Found</Text>
                    )
                }
            </ScrollView>
        </View>
    );
}