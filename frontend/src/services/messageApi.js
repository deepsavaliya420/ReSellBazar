import api from "./api";

export const sendMessage = async (messageData) => {
    const response = await api.post(
        "/messages",
        messageData
    );

    return response.data;
};

export const getMessages = async (userId) => {
    const response = await api.get(
        `/messages/${userId}`
    );

    return response.data;
};