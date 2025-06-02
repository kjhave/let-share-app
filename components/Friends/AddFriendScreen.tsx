import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import AddFriendModal from "@/components/Friends/AddFriendModal";
import FriendRequestButton from "@/components/Friends/FriendRequestButton";
import { fetchSecurely } from "@/utils/storage";

import { getContactInfor, type contactInformation } from "@/services/account";
import { sendFriendRequest } from "@/services/friends";
import { useToast } from "../ToastContext";

export default function FriendRequest() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isOpen = useSharedValue(false);
    const overlayOpacity = useSharedValue(0);

    const noti = useToast();

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const openModal = () => {
        isOpen.value = true;
        setIsModalVisible(true);
        overlayOpacity.value = withTiming(0.3, { duration: 300 });
    };

    const closeModal = () => {
        overlayOpacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(setIsModalVisible)(false);
        });
        isOpen.value = false;
    };

    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchUserId = async () => {
            const user = await fetchSecurely("userId");
            if (user) {
                setUserId(user);
            } else {
                console.error("No user ID found in secure storage");
            }
        }

        fetchUserId();
    }, [userId]);


    const [friendCode, setFriendCode] = useState("");
    const handdleSetFriendCode = (val: string) => {
        setFriendCode(val);
    }

    const [foundUser, setFoundUser] = useState<{ id: string; name: string } | null>(null);
    const [notFound, setNotFound] = useState(false);
    const onFind = async (): Promise<void> => {
        try {
            const user = await getContactInfor(friendCode);
            if (user) {
                setFoundUser({ id: friendCode, name: user.name });
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error("Error fetching contact information:", error);
            setNotFound(true);
        }
    }

    const onSendRequest = async (): Promise<void> => {
        if (!foundUser) {
            console.error("No user found");
            return;
        }

        if (userId == foundUser?.id) {
            console.error("You cannot send a friend request to yourself");
            return;
        }

        try {
            await sendFriendRequest(foundUser?.id);
            noti.show("Friend request sent", "success");
            console.log("Friend request sent successfully");
        }
        catch (error) {
            noti.show("Something went wrong", "error");
            console.error("Error sending friend request:", error);
        }
    }

    return (
        <>
            {isModalVisible && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: "black", zIndex: 1 },
                        overlayStyle,
                    ]}
                >
                    <Pressable onPress={closeModal} style={{ flex: 1 }} />
                </Animated.View>
            )}
            {isModalVisible && (
                <AddFriendModal
                    userId={userId}
                    onClose={closeModal}
                    onFind={onFind}
                    friendCode={friendCode}
                    setFriendCode={handdleSetFriendCode}
                    foundUser={foundUser}
                    notFound={notFound}
                    onSendRequest={onSendRequest}
                />
            )}

            {!isModalVisible && <FriendRequestButton onPress={openModal} />}
        </>
    );
}
