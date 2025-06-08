import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import {
    fetchSecurely, 
    deleteSecurely,
    saveToStorage,
    getFromStorage,
} from "@/utils/storage";

export const createHangout = async ({
    name,
    description = "",
}: {
    name: string;
    description?: string;
}): Promise<void> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (existingCode && existingCode !== "") {
            throw new Error("Already have a hangout, please leave it first.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to create hangout with status ${response.status}, message: ${data.message}`);
        }

        const data = await response.json();
        saveToStorage("user_hangoutCode", data.code);
    } catch (error) {
        console.error("Error creating hangout:", error);
        throw error;
    }
}

export const getUserHangoutStatus = async (): Promise<string|null> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (existingCode && existingCode !== "") {
            return existingCode;
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/status/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to create hangout with status ${response.status}, message: ${data.message}`);
        }

        const data = await response.json();
        if (data.status === true) {
            if (!data.code || data.code === "") {
                throw new Error("User is in a hangout, but no code found.");
            }
            
            saveToStorage("user_hangoutCode", data.code);
            return data.code;
        }

        return null;
    } catch (error) {
        console.error("Error creating hangout:", error);
        throw error;
    }
}