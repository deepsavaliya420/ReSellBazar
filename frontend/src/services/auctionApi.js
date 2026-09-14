import api from "./api";

export const getAuctions = async () => {
    const response = await api.get("/auctions");
    return response.data;
};

export const getAuctionById = async (id) => {
    const response = await api.get(`/auctions/${id}`);
    return response.data;
};

export const createAuction = async (auctionData) => {
    const response = await api.post("/auctions", auctionData);
    return response.data;
};

export const endAuction = async (id) => {
    const response = await api.put(`/auctions/${id}/end`);
    return response.data;
};