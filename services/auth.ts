import Constants from 'expo-constants';

// const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;
const SERVER_URL = "http://192.168.1.9:8000";

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
): Promise<void> => {w
    // try {
    //     const bodyContent = {
    //         "user":userInformation
    //     }
    //     await fetch(SERVER_URL + "/authentication/register", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(bodyContent),
    //     })
    // } catch (error) {
    //     console.error("Error signing up user:", error);
    //     throw error;
    // }
    try {
        const response = await fetch('http://192.168.1.9:8000/test');
        const text = await response.text();
        console.log('Test response:', text);
    } catch (error) {
        console.error('Error calling /test:', error);
        throw error;
    }
}