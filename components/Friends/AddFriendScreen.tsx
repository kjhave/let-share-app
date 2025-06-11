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

    const { showToast } = useToast();

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
    const [usercode, setUserCode] = useState("");

    useEffect(() => {
        const fetchUserInfor = async () => {
            const tmpId = await fetchSecurely("userId");
            const tmpcode = await fetchSecurely("code");
            if (tmpId && tmpcode) {
                setUserId(tmpId);
                setUserCode(tmpcode);
            } else {
                console.error("No user found in secure storage");
            }
        }

        fetchUserInfor();
    }, []);


    const [friendCode, setFriendCode] = useState("");
    const handdleSetFriendCode = (val: string) => {
        setFriendCode(val);
    }

    const [foundUser, setFoundUser] = useState<{ id: string; name: string } | null>(null);
    const [notFound, setNotFound] = useState(false);
    const onFind = async (): Promise<void> => {
        try {
            const user: contactInformation = await getContactInfor(friendCode);
            if (user) {
                setFoundUser({ id: user.userId, name: user.name });
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
            showToast("User not found", { type: "error" });
            console.error("No user found");
            return;
        }

        if (userId == foundUser?.id) {
            console.error("You cannot send a friend request to yourself");
            return;
        }

        try {
            await sendFriendRequest(foundUser?.id);
            showToast("Friend request sent", { type: "success" });
            console.log("Friend request sent successfully");
        }
        catch (error) {
            showToast("Something went wrong", { type: "error" });
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
                    usercode={usercode}
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
