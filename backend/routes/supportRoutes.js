const express = require("express");

const router = express.Router();

const {
    createTicket,
    getMyTickets,
    getAllTickets,
    getTicketById,
    updateTicket,
    addTicketMessage
} = require("../controllers/supportController");

const authMiddleware = require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");


router.post(
    "/",
    authMiddleware,
    createTicket
);


router.get(
    "/my",
    authMiddleware,
    getMyTickets
);


router.get(
    "/all",
    authMiddleware,
    authorizeRoles("admin"),
    getAllTickets
);


router.get(
    "/:id",
    authMiddleware,
    getTicketById
);


router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateTicket
);


router.post(
    "/:id/messages",
    authMiddleware,
    addTicketMessage
);


module.exports = router;