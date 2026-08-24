const Message = require("../models/Message");

const sendMessage = async (req, res) => {
    try {
        const message = await Message.create({
            sender: req.user.id,
            receiver: req.body.receiver,
            message: req.body.message
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: message
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                {
                    sender: req.user.id,
                    receiver: req.params.userId
                },
                {
                    sender: req.params.userId,
                    receiver: req.user.id
                }
            ]
        })
        .populate("sender", "name")
        .populate("receiver", "name")
        .sort({
            createdAt: 1
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get messages",
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};