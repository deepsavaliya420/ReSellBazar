const express = require("express");
const router = express.Router();

const {
    addAddress,
    getAddresses,
    deleteAddress
} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addAddress);
router.get("/", getAddresses);
router.delete("/:id", deleteAddress);

module.exports = router;