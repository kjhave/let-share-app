import { Text, View } from "react-native";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { fetchSecurely } from "@/utils/storage";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await fetchSecurely('access_token');
            if (token) {
                // Token exists, user is logged in
                router.replace('/home');
            } else {
                // No token, go to login
                router.replace('/auth/login');
            }
        };

        checkAuth();
    }, []);

  return (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Text>Assume that this is a fancy screen</Text>
    </View>
  );
}