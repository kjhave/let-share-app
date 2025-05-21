import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;

if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined in the Expo config (app.config.js/json).");
}

import { fetchSecurely, saveSecurely, deleteSecurely } from "@/utils/storage";

export type Friend = {
    id: string;
    name: string;
}

export const getFriends = async (): Promise<Friend[]> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/friends`, {
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
            throw new Error(`Failed to fetch friend list with status ${response.status}`);
        }

        const data = await response.json();
        
        console.log("Friend data:", data);

        if (!Array.isArray(data)) {
            throw new Error("Failed to fetch friend list");
        }

        data.forEach((friend: any) => {
            if (typeof friend !== 'object' || !friend.id || !friend.name) {
                throw new Error("Failed to fetch friend list");
            }
        });

        return data;
    } catch (error) {
        console.error("Error fetching friend list:", error);
        throw error;
    }
}

export type FriendRequest = {
    id: string;
    name: string;
}

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/friends/requests`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, delete it
                await deleteSecurely("token");
                throw new Error("Token expired or invalid.");
            }
            throw new Error(`Failed to fetch friend requests with status ${response.status}, message: ${data.message}`);
        }

        if (!Array.isArray(data)) {
            throw new Error("Failed to fetch friend requests");
        }

        data.forEach((request: any) => {
            if (typeof request !== 'object' || !request.id || !request.name) {
                throw new Error("Failed to fetch friend requests");
            }
        });

        return data;
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        throw error;
    }
}

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/friends/requests/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'accept',
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
            throw new Error(`Failed to accept friend request with status ${response.status}, message: ${data.message}`);
        }
    } catch (error) {
        console.error("Error accept friend request:", error);
        throw error;
    }
}

export const denyFriendRequest = async (friendId: string): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/friends/requests/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'deny',
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
            throw new Error(`Failed to deny friend request with status ${response.status}, message: ${data.message}`);
        }
    } catch (error) {
        console.error("Error deny friend request:", error);
        throw error;
    }
}

export const sendFriendRequest = async (friendId: string): Promise<void> => {
    try {
        const token = await fetchSecurely("token");
        if (!token) {
            throw new Error("No token found in secure storage");
        }

        const response = await fetch(`${SERVER_URL}/accounts/friends/requests/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
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
            throw new Error(`Failed to send friend request with status ${response.status}, message: ${data.message}`);
        }
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
}
