const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

const updateAuctionStatus = async (auction) => {
    const now = new Date();

    if (
        auction.status !== "pending" &&
        auction.status !== "rejected" &&
        auction.status !== "cancelled" &&
        auction.status !== "ended" &&
        now >= auction.endTime
    ) {
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

        return;
    }

    if (
        auction.status === "upcoming" &&
        now >= auction.startTime &&
        now < auction.endTime
    ) {
        auction.status = "active";

        await auction.save();
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
                message:
                    "Invalid start or end time"
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

        if (now >= end) {
            return res.status(400).json({
                message:
                    "Auction end time must be in the future"
            });
        }

        /*
         * Seller submissions are now created as
         * pending approval requests.
         *
         * The auction cannot become active or
         * receive bids until an admin approves it.
         */
        const auction = await Auction.create({
            seller: req.user.id,
            product,
            startingPrice: Number(
                startingPrice
            ),
            currentPrice: Number(
                startingPrice
            ),
            startTime: start,
            endTime: end,
            status: "pending"
        });

        res.status(201).json({
            message:
                "Auction submitted for admin approval",
            auction
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to submit auction",
            error: error.message
        });
    }
};

const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .populate("product")
            .populate(
                "seller",
                "name email"
            )
            .populate(
                "winner",
                "name email"
            );

        for (const auction of auctions) {
            await updateAuctionStatus(
                auction
            );
        }

        const updatedAuctions =
            await Auction.find()
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        res.json(updatedAuctions);
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to get auctions",
            error: error.message
        });
    }
};

const getAuction = async (req, res) => {
    try {
        const auction =
            await Auction.findById(
                req.params.id
            )
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        await updateAuctionStatus(
            auction
        );

        const updatedAuction =
            await Auction.findById(
                req.params.id
            )
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        res.json(updatedAuction);
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to get auction",
            error: error.message
        });
    }
};

const approveAuction = async (
    req,
    res
) => {
    try {
        const auction =
            await Auction.findById(
                req.params.id
            );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (auction.status !== "pending") {
            return res.status(400).json({
                message:
                    "Only pending auctions can be approved"
            });
        }

        const now = new Date();

        if (now >= auction.endTime) {
            return res.status(400).json({
                message:
                    "Auction end time has already passed"
            });
        }

        if (now >= auction.startTime) {
            auction.status = "active";
        } else {
            auction.status = "upcoming";
        }

        await auction.save();

        const updatedAuction =
            await Auction.findById(
                auction._id
            )
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        res.json({
            message:
                "Auction approved successfully",
            auction: updatedAuction
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to approve auction",
            error: error.message
        });
    }
};

const rejectAuction = async (
    req,
    res
) => {
    try {
        const auction =
            await Auction.findById(
                req.params.id
            );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (auction.status !== "pending") {
            return res.status(400).json({
                message:
                    "Only pending auctions can be rejected"
            });
        }

        auction.status = "rejected";
        auction.winner = null;

        await auction.save();

        const updatedAuction =
            await Auction.findById(
                auction._id
            )
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        res.json({
            message:
                "Auction rejected successfully",
            auction: updatedAuction
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to reject auction",
            error: error.message
        });
    }
};

const endAuction = async (req, res) => {
    try {
        const auction =
            await Auction.findById(
                req.params.id
            );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
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
                message:
                    "Auction is already ended"
            });
        }

        if (
            auction.status === "pending" ||
            auction.status === "rejected"
        ) {
            return res.status(400).json({
                message:
                    "This auction cannot be ended"
            });
        }

        auction.status = "ended";

        const highestBid =
            await Bid.findOne({
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
            await Auction.findById(
                auction._id
            )
                .populate("product")
                .populate(
                    "seller",
                    "name email"
                )
                .populate(
                    "winner",
                    "name email"
                );

        res.json({
            message:
                "Auction ended successfully",
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
    approveAuction,
    rejectAuction,
    endAuction
};