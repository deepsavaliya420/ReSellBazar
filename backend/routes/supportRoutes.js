const express = require("express");
const router = express.Router();

const {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicket
} = require("../controllers/supportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateTicket
);

module.exports = router;