import api from "./api";

export const createSupportTicket = async (ticketData) => {
    const response = await api.post(
        "/support",
        ticketData
    );

    return response.data;
};

export const getMySupportTickets = async () => {
    const response = await api.get("/support/my");

    return response.data;
};

export const getAllSupportTickets = async () => {
    const response = await api.get("/support/all");

    return response.data;
};

export const getAllTickets = async () => {
    const response = await api.get("/support/all");

    return response.data;
};

export const updateSupportTicket = async (
    id,
    status
) => {
    const response = await api.put(
        `/support/${id}`,
        { status }
    );

    return response.data;
};

export const updateTicket = async (id, status) => {
    const response = await api.put(
        `/support/${id}`,
        { status }
    );

    return response.data;
};