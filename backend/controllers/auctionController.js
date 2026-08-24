const Auction = require("../models/Auction");

const createAuction = async (req, res) => {
    try {
        const auction = await Auction.create({
            seller: req.user.id,
            product: req.body.product,
            startingPrice: req.body.startingPrice,
            currentPrice: req.body.startingPrice,
            startTime: req.body.startTime,
            endTime: req.body.endTime
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

        res.json(auctions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get auctions",
            error: error.message
        });
    }
};

const getAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate("product")
            .populate("seller", "name email")
            .populate("winner", "name email");

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        res.json(auction);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get auction",
            error: error.message
        });
    }
};

const endAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        auction.status = "ended";
        await auction.save();

        res.json({
            message: "Auction ended successfully",
            auction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to end auction",
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