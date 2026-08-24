const express = require("express");
const router = express.Router();

const {
    createReturn,
    getReturns,
    updateReturn
} = require("../controllers/returnController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    createReturn
);

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("buyer"),
    getReturns
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateReturn
);

module.exports = router;