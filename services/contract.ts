import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import { fetchSecurely, deleteSecurely } from '@/utils/storage';

export const makeContract = async ({
    name = "",
    fromId,
    toId,
    amount,
    description = ""
}: {
    name: string,
    fromId: string,
    toId: string,
    amount: number,
    description: string
}): Promise<void> => {
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
                contractName: name,
                contractPayer: fromId,
                contractSplitters: [{
                    userId: toId,
                    itemList: [{
                        itemName:"Money",
                        itemPrice:amount
                    }]
                }],
                contractDescription: description
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

export const makeBillShare = async ({
    name = "",
    contractPayer,
    contractSplitters = [],
    description = ""
}: {
    name: string,
    contractPayer: string,
    contractSplitters: { userId: string, itemList: { itemName: string, itemPrice: number }[] }[],
    description?: string
}): Promise<void> => {
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
                contractName: name,
                contractPayer: contractPayer,
                contractSplitters: contractSplitters,
                contractDescription: description
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }

            const data = await response.json();
            throw new Error(`Failed to making bill share with status ${response.status}, message: ${data.message}`);
        }
    }
    catch (error){
        console.log("Error making bill share:", error);
    }
}