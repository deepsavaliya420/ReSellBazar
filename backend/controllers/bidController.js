const Bid = require("../models/Bid");
const Auction = require("../models/Auction");

const placeBid = async (req, res) => {
    try {
        const auction = await Auction.findById(
            req.body.auction
        );

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        const now = new Date();

        if (
            now < auction.startTime ||
            now >= auction.endTime
        ) {
            return res.status(400).json({
                message: "Auction is not active"
            });
        }

        if (auction.status === "ended") {
            return res.status(400).json({
                message: "Auction has ended"
            });
        }

        if (auction.status === "cancelled") {
            return res.status(400).json({
                message: "Auction has been cancelled"
            });
        }

        if (
            Number(req.body.amount) <=
            Number(auction.currentPrice)
        ) {
            return res.status(400).json({
                message:
                    "Bid must be greater than current price"
            });
        }

        const bid = await Bid.create({
            auction: auction._id,
            buyer: req.user.id,
            amount: Number(req.body.amount)
        });

        auction.currentPrice =
            Number(req.body.amount);

        auction.status = "active";

        await auction.save();

        res.status(201).json({
            message: "Bid placed successfully",
            bid,
            currentPrice: auction.currentPrice
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to place bid",
            error: error.message
        });
    }
};

const getBids = async (req, res) => {
    try {
        const bids = await Bid.find({
            auction: req.params.auctionId
        })
            .populate("buyer", "name email")
            .sort({
                amount: -1,
                createdAt: 1
            });

        res.json(bids);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get bids",
            error: error.message
        });
    }
};

module.exports = {
    placeBid,
    getBids
};