import api from "./api";

export const createBid = async (bidData) => {
    const response = await api.post("/bids", bidData);
    return response.data;
};

export const getAuctionBids = async (auctionId) => {
    const response = await api.get(`/bids/${auctionId}`);
    return response.data;
};