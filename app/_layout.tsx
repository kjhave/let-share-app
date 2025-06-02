import { Stack } from "expo-router";

import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@/components/ToastContext";

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <ToastProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    
                </Stack>
            </ToastProvider>
        </GestureHandlerRootView>
    );
}