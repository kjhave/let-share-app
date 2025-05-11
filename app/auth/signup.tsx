import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { signupUser } from "@/services/auth";

export default function SignupScreen() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const route = useRouter();

    const handleSignup = async () => {
        console.log("Signup pressed", { username, name, email, password, confirmPassword });
        try {
            await signupUser({
                username: username,
                name: name,
                email: email,
                password: password,
            });
            route.back();
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const handleLogin = () => {
        route.back();
    };

    return (
        <View className="flex-1 justify-center bg-white px-6 py-8">
            <Text className="text-3xl font-bold mb-8 text-center text-[#0D3B66]">Signup</Text>

            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholder="Username"
                placeholderTextColor="#7F9DB1"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholder="Name"
                placeholderTextColor="#7F9DB1"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholder="Email"
                placeholderTextColor="#7F9DB1"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholder="Password"
                placeholderTextColor="#7F9DB1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
                placeholder="Confirm Password"
                placeholderTextColor="#7F9DB1"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <Pressable
                className="bg-[#0D3B66] py-4 rounded-lg mb-4 active:bg-[#0A3055]"
                onPress={handleSignup}
            >
                <Text className="text-white text-center font-semibold text-base">
                    Signup
                </Text>
            </Pressable>

            <View className="border-t border-gray-300 mb-6" />

            <TouchableOpacity onPress={handleLogin}>
                <Text className="text-center text-gray-700 text-base">
                    Already have an account? <Text className="text-[#7F9DB1] underline">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}