import api from "./api";

export const createPayment = async (paymentData) => {
    const response = await api.post("/payments", paymentData);
    return response.data;
};

export const getPayment = async (orderId) => {
    const response = await api.get(`/payments/${orderId}`);
    return response.data;
};