import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import { fetchSecurely, saveSecurely, deleteSecurely } from "@/utils/storage";

export const getAccountInfor = async (): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/profile`, {
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
            throw new Error(`Failed to fetch account information with status ${response.status}`);
        }

        const data = await response.json();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                await saveSecurely(key, data[key]);
            }
        }
    } catch (error) {
        console.error("Error fetching account information:", error);
        throw error;
    }
}

export type contactInformation = {
    userId: string;
    name: string;
    code: string;
}

export const getContactInfor = async (usercode: string): Promise<contactInformation> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/contactInformation/${usercode}`, {
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
            throw new Error(`Failed to fetch account information with status ${response.status}`);
        }

        const data = await response.json();

        if (typeof data !== 'object' || !data.userId || !data.name || !data.code) {
            throw new Error("Failed to fetch account information");
        }

        return data;
    } catch (error) {
        console.error("Error fetching account information:", error);
        throw error;
    }
}