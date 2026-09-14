import api from "./api";

export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get("/orders/my");
    return response.data;
};

export const getAllOrders = async () => {
    const response = await api.get("/orders/all");
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, {
        status
    });
    return response.data;
};