import api from "./api";

export const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, {
        role
    });

    return response.data;
};

export const updateProductStatus = async (id, status) => {
    const response = await api.put(`/admin/products/${id}/status`, {
        status
    });

    return response.data;
};