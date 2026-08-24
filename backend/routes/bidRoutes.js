const express = require("express");
const router = express.Router();

const {
    placeBid,
    getBids
} = require("../controllers/bidController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    placeBid
);

router.get(
    "/:auctionId",
    authMiddleware,
    getBids
);

module.exports = router;