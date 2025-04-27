import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true, 
                animationDuration: 300,
            }}
        >
            <Stack.Screen name="login"></Stack.Screen>
            <Stack.Screen name="signup"></Stack.Screen>
        </Stack>
    );
}
