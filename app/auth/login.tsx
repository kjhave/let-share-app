import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { loginUser } from "@/services/auth";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const route = useRouter();

    const handleLogin = async () => {
        await loginUser({
            username: username,
            password: password,
        });
        route.replace("/");
    };

    const handleSignup = () => {
        route.push("/auth/signup");
    };

    const handleForgotPassword = () => {
        console.log("nothing");
    };

    return (
        <View className="flex-1 justify-center bg-white px-6 py-8">
            <Text className="text-3xl font-bold mb-8 text-center text-[#0D3B66]">Login</Text>

            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholderTextColor="#7F9DB1"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholderTextColor="#7F9DB1"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable
                className="bg-[#0D3B66] py-4 rounded-lg mb-4 active:bg-[#0A3055]"
                onPress={handleLogin}
            >
                <Text className="text-white text-center font-semibold text-base">
                    Login
                </Text>
            </Pressable>

            <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-center text-[#7F9DB1] underline mb-4 text-base">
                    Forgot password?
                </Text>
            </TouchableOpacity>

            <View className="border-t border-gray-300 mb-6" />

            <Pressable
                className="bg-gray-200 py-4 rounded-lg active:bg-gray-300"
                onPress={handleSignup}
            >
                <Text className="text-center font-semibold text-base text-gray-800">
                    Signup
                </Text>
            </Pressable>
        </View>
    );
}