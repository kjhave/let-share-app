import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

export const signupUser = async (
    userInformation:{
        username: string;
        name: string;
        email: string;
        password: string;
    }
): Promise<void> => {
    try {
        const bodyContent = {
            "user":userInformation
        }
        await fetch(`${SERVER_URL}/authentication/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyContent),
        })
    } catch (error) {
        console.error("Error signing up user:", error);
        throw error;
    }
}

import { saveSecurely } from "@/utils/storage";
export const loginUser = async (
    userInformation:{
        username: string;
        password: string;
    }
): Promise<void> => {
    try {
        const response = await fetch(`${SERVER_URL}/authentication/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInformation),
        });

        if (!response.ok) {
            throw new Error(`Login failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.token) {
            throw new Error("Failed to retrieve token from response");
        }

        console.log("Token received:", data.token);

        await saveSecurely("token", data.token);
    } catch (error) {
        console.error("Error signing up user:", error);
        throw error;
    }
}