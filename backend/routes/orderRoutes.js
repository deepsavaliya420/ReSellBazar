const express = require("express");

const router =
    express.Router();

const {
    createOrder,
    getMyOrders,
    getSellerOrders,
    getAllOrders,
    updateOrderStatus,
    updateDelivery
} =
    require(
        "../controllers/orderController"
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
    createOrder
);


router.get(
    "/my",
    authMiddleware,
    authorizeRoles("buyer"),
    getMyOrders
);


router.get(
    "/seller",
    authMiddleware,
    authorizeRoles("seller"),
    getSellerOrders
);


router.get(
    "/all",
    authMiddleware,
    authorizeRoles("admin"),
    getAllOrders
);


router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles(
        "admin",
        "seller"
    ),
    updateOrderStatus
);


router.put(
    "/:id/delivery",
    authMiddleware,
    authorizeRoles("admin"),
    updateDelivery
);


module.exports = router;