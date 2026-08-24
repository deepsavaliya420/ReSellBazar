const express = require("express");
const router = express.Router();

const {
    createAuction,
    getAuctions,
    getAuction,
    endAuction
} = require("../controllers/auctionController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getAuctions);

router.get("/:id", getAuction);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("seller"),
    createAuction
);

router.put(
    "/:id/end",
    authMiddleware,
    authorizeRoles("seller", "admin"),
    endAuction
);

module.exports = router;