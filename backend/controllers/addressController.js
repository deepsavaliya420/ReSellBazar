const Address = require("../models/Address");

const addAddress = async (req, res) => {
    try {
        if (req.body.isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }

        const address = await Address.create({
            user: req.user.id,
            ...req.body
        });

        res.status(201).json({
            message: "Address added successfully",
            address
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add address",
            error: error.message
        });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user.id
        });

        res.json(addresses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get addresses",
            error: error.message
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        res.json({
            message: "Address deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete address",
            error: error.message
        });
    }
};

module.exports = {
    addAddress,
    getAddresses,
    deleteAddress
};