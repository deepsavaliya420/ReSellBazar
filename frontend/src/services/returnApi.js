import api from "./api";

export const createReturn = async (returnData) => {
    const response = await api.post("/returns", returnData);
    return response.data;
};

export const getMyReturns = async () => {
    const response = await api.get("/returns/my");
    return response.data;
};

export const getAllReturns = async () => {
    const response = await api.get("/returns/all");
    return response.data;
};

export const updateReturn = async (id, status) => {
    const response = await api.put(`/returns/${id}`, {
        status
    });
    return response.data;
};