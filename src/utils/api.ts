
import { store } from '../utils/store';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const loginApi = async (username: string, password: string) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return await response.json();
}

const registerApi = async (username: string, password: string, type: string, name: string, lastName: string, email: string, lineId: string) => {
    const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type, name, lastName, email, lineId: lineId !== "" ? lineId : null }),
    });
    return await response.json();
}

const getUserListApi = async () => {
    const token = store.getState().auth.profile.token;
    try {
        const response = await fetch(`${apiUrl}/chat/getUserList`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getImageChat = async (id: string): Promise<string | undefined> => {
    const token = store.getState().auth.profile.token;
    try {
        const response = await fetch(`${apiUrl}/chat/getImageChat?id=${id}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching the image:', error);
        throw error;
    }
}



export {
    loginApi,
    registerApi,
    getUserListApi,
    getImageChat
};
