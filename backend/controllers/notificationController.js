const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get notifications",
            error: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                read: true
            }
        );

        res.json({
            message: "Notification marked as read"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead
};