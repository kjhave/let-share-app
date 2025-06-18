import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import { fetchSecurely, deleteSecurely, getFromStorage } from '@/utils/storage';

export const makeHangoutContract = async ({
    name = "",
    fromId,
    toId,
    amount,
    description = "",
}: {
    name: string,
    fromId: string,
    toId: string,
    amount: number,
    description: string,
}): Promise<void> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/contract/make`, {
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
                contractDescription: description,
                contractTotalCost: amount,
                hangoutCode: existingCode,
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
        throw error;
    }
}

export const makeHangoutBillShare = async ({
    name = "",
    contractPayer,
    contractSplitters = [],
    description = "",
    totalAmount,
}: {
    name: string,
    contractPayer: string,
    contractSplitters: { userId: string, itemList: { itemName: string, itemPrice: number }[] }[],
    description?: string,
    totalAmount: number,
}): Promise<void> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/contract/make`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                contractName: name,
                contractPayer: contractPayer,
                contractSplitters: contractSplitters,
                contractDescription: description,
                contractTotalCost: totalAmount,
                hangoutCode: existingCode,
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
        throw error;
    }
}

export type IContractLog = {
    id: string,
    contractName: string;
    contractDescription?: string;
    contractTotalCost: number;
    contractPayer: string;
    contractSplitters: Array<{
        userId: string;
        itemList: Array<{
            itemName: string;
            itemPrice: number;
        }>;
    }>;
}

export const getHangoutContracts = async (): Promise<{ contract: IContractLog, isSubmitted: boolean }[]> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/contract/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hangoutCode: existingCode
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }

            const data = await response.json();
            throw new Error(`Failed to fetch contracts with status ${response.status}, message: ${data.message}`);
        }

        const res = await response.json();
        if (!res || !res?.data || !res?.data?.contracts)  [];

        return res.data.contracts;
    }
    catch (error){
        console.log("Error fetching contracts:", error);
        throw error;
    }
}

export type relation = {
    userId1: string,
    userId2: string,
    amount: number
}

export const calculateHangoutContract = async ({
    submitContracts
}: {
    submitContracts: string[]
}): Promise<relation[]> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/contract/calculate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hangoutCode: existingCode,
                submitContracts: submitContracts
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }

            const data = await response.json();
            throw new Error(`Failed to calculate hangout contract result with status ${response.status}, message: ${data.message}`);
        }

        const res = await response.json();
        if (!res?.data || !res.data?.relations)   throw new Error("Failed to calculate hangout contract result");
        
        return res.data.relations;
    }
    catch (error){
        console.log("Error calculating hangout contract result:", error);
        throw error;
    }
}

export const submitHangoutRelations = async ({
    submitContracts,
    submitRelations
}: {
    submitContracts: string[]
    submitRelations: relation[]
}): Promise<void> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/contract/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hangoutCode: existingCode,
                submitContracts: submitContracts,
                submitRelations: submitRelations
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }

            const data = await response.json();
            throw new Error(`Failed to calculate hangout contract result with status ${response.status}, message: ${data.message}`);
        }
    }
    catch (error){
        console.log("Error calculating hangout contract result:", error);
        throw error;
    }
}