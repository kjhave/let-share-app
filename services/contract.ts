import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import { fetchSecurely, deleteSecurely } from '@/utils/storage';

export const makeContract = async (fromId: string, toId: string, amount: number): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/contract/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                contractPayer: fromId,
                contractSplitters: [{
                    userId: toId,
                    itemList: [{
                        itemName:"Money",
                        itemPrice:amount
                    }]
                }]
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }

            const data = await response.json();
            throw new Error(`Failed to making contract with status ${response.status}, message: ${data.message}`);
        }
    }
    catch (error){
        console.log("Error making contract:", error);
    }
}