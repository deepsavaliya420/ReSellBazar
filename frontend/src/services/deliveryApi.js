import api from "./api";

export const createDelivery = async (deliveryData) => {
    const response = await api.post("/deliveries", deliveryData);
    return response.data;
};

export const getDelivery = async (orderId) => {
    const response = await api.get(`/deliveries/${orderId}`);
    return response.data;
};

export const updateDelivery = async (id, deliveryData) => {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
};