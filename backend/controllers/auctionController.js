const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

const updateAuctionStatus = async (auction) => {
    const now = new Date();

    if (
        auction.status !== "cancelled" &&
        now >= auction.endTime
    ) {
        auction.status = "ended";

        const highestBid = await Bid.findOne({
            auction: auction._id
        }).sort({
            amount: -1
        });

        auction.winner = highestBid
            ? highestBid.buyer
            : null;

        await auction.save();

        return;
    }

    if (
        auction.status !== "cancelled" &&
        now >= auction.startTime &&
        now < auction.endTime
    ) {
        if (auction.status !== "active") {
            auction.status = "active";
            await auction.save();
        }
    }
};

const createAuction = async (req, res) => {
    try {
        const {
            product,
            startingPrice,
            startTime,
            endTime
        } = req.body;

        if (
            !product ||
            startingPrice === undefined ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message:
                    "Product, starting price, start time and end time are required"
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid start or end time"
            });
        }

        if (end <= start) {
            return res.status(400).json({
                message:
                    "End time must be after start time"
            });
        }

        if (Number(startingPrice) <= 0) {
            return res.status(400).json({
                message:
                    "Starting price must be greater than 0"
            });
        }

        const now = new Date();

        let status = "upcoming";

        if (now >= start && now < end) {
            status = "active";
        }

        if (now >= end) {
            return res.status(400).json({
                message:
                    "Auction end time must be in the future"
            });
        }

        const auction = await Auction.create({
            seller: req.user.id,
            product,
            startingPrice: Number(startingPrice),
            currentPrice: Number(startingPrice),
            startTime: start,
            endTime: end,
            status
        });

        res.status(201).json({
            message: "Auction created successfully",
            auction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create auction",
            error: error.message
        });
    }
};

const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .populate("product")
            .populate("seller", "name email")
            .populate("winner", "name email");

        for (const auction of auctions) {
            await updateAuctionStatus(auction);
        }

        const updatedAuctions = await Auction.find()
            .populate("product")
            .populate("seller", "name email")
            .populate("winner", "name email");

        res.json(updatedAuctions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get auctions",
            error: error.message
        });
    }
};

const getAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(
            req.params.id
        )
            .populate("product")
            .populate("seller", "name email")
            .populate("winner", "name email");

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        await updateAuctionStatus(auction);

        const updatedAuction =
            await Auction.findById(req.params.id)
                .populate("product")
                .populate("seller", "name email")
                .populate("winner", "name email");

        res.json(updatedAuction);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get auction",
            error: error.message
        });
    }
};

const endAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(
            req.params.id
        );

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        if (
            req.user.role === "seller" &&
            auction.seller.toString() !==
                req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only end your own auctions"
            });
        }

        if (auction.status === "ended") {
            return res.status(400).json({
                message: "Auction is already ended"
            });
        }

        auction.status = "ended";

        const highestBid = await Bid.findOne({
            auction: auction._id
        }).sort({
            amount: -1
        });

        if (highestBid) {
            auction.currentPrice =
                highestBid.amount;

            auction.winner =
                highestBid.buyer;
        } else {
            auction.winner = null;
        }

        await auction.save();

        const updatedAuction =
            await Auction.findById(auction._id)
                .populate("product")
                .populate("seller", "name email")
                .populate("winner", "name email");

        res.json({
            message: "Auction ended successfully",
            auction: updatedAuction
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to end auction",
            error: error.message
        });
    }
};

module.exports = {
    createAuction,
    getAuctions,
    getAuction,
    endAuction
};