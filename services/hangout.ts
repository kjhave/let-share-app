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
    deleteFromStorage,
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
        await saveToStorage("user_hangoutCode", data.code);
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

export const leaveHangout = async (): Promise<void> => {
    try {
        const existingCode = await getFromStorage("user_hangoutCode");
        if (!existingCode || existingCode === "") {
            throw new Error("You are not in a hang out.");
        }

        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({hangoutCode: existingCode })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to leave hangout with status ${response.status}, message: ${data.message}`);
        }

        // Clear the hangout code from storage
        await deleteFromStorage("user_hangoutCode");
    } catch (error) {
        console.log("Error leaving hangout:", error);
        throw error;
    }
}

export type HangoutParticipant = {
    id: string;
    name: string;
};

export const getHangoutParticipants = async (hangoutCode: string): Promise<HangoutParticipant[]> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/participants`, {
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
            throw new Error(`Failed to get participants with status ${response.status}, message: ${data.message}`);
        }

        const data = await response.json();
        if (!data?.participants)    return [];
        return data.participants;
    } catch (error) {
        console.error("Error fetching hangout participants:", error);
        throw error;
    }
}

export const sendHangoutInvitation = async ({
    hangoutCode,
    friendId
}: {
    hangoutCode: string,
    friendId: string
}): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/invitation/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hangoutCode: hangoutCode,
                friendId: friendId
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to leave hangout with status ${response.status}, message: ${data.message}`);
        }
    } catch (error) {
        console.log("Error leaving hangout:", error);
        throw error;
    }
}

export type HangoutInvitationType = {
    userProfile: {
        id: string,
        name: string
    }
    hangoutCode: string;
}

export const getHangoutInvitations = async (): Promise<HangoutInvitationType[]> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/invitation`, {
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
            throw new Error(`Failed to leave hangout with status ${response.status}, message: ${data.message}`);
        }

        const data = await response.json();

        if (!Array.isArray(data))
            throw Error('Failed to fetch invitation list');

        return data;
    } catch (error) {
        console.log("Error leaving hangout:", error);
        throw error;
    }
}

export const acceptHangoutInvitation = async ({
    hangoutCode,
    senderId
}: {
    hangoutCode: string,
    senderId: string
}): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/invitation/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                senderId: senderId,
                type: "accept",
                hangoutCode: hangoutCode,
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to accept hangout invitation with status ${response.status}, message: ${data.message}`);
        }

        await saveToStorage("user_hangoutCode", hangoutCode);
        
    } catch (error) {
        console.log("Error accepting hangout invitation hangout:", error);
        throw error;
    }
}

export const joinHangoutWithCode = async ({
    hangoutCode,
}: {
    hangoutCode: string,
}): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/hangout/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hangoutCode: hangoutCode,
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            const data = await response.json();
            throw new Error(`Failed to accept hangout invitation with status ${response.status}, message: ${data.message}`);
        }

        await saveToStorage("user_hangoutCode", hangoutCode);
    } catch (error) {
        console.log("Error accepting hangout invitation hangout:", error);
        throw error;
    }
}