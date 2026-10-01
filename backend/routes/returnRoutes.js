const express = require("express");

const router =
    express.Router();

const {
    createReturn,
    getReturns,
    getAllReturns,
    updateReturn
} =
    require(
        "../controllers/returnController"
    );

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const authorizeRoles =
    require(
        "../middleware/roleMiddleware"
    );


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


router.get(
    "/all",
    authMiddleware,
    authorizeRoles("admin"),
    getAllReturns
);


router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateReturn
);


module.exports = router;