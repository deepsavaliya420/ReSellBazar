import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getMyOrders } from "../../services/orderApi";


const formatStatus = (status) => {
    if (!status) {
        return "Unknown";
    }

    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
};


const formatDate = (date) => {
    if (!date) {
        return "Not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
};


const getStatusClass = (status) => {
    if (status === "delivered") {
        return "order-status-delivered";
    }

    if (
        status === "shipped" ||
        status === "out_for_delivery"
    ) {
        return "order-status-shipping";
    }

    if (status === "cancelled") {
        return "order-status-cancelled";
    }

    return "order-status-pending";
};


const getProgressStep = (status) => {
    if (status === "placed") {
        return 1;
    }

    if (status === "confirmed") {
        return 2;
    }

    if (status === "shipped") {
        return 3;
    }

    if (status === "out_for_delivery") {
        return 4;
    }

    if (status === "delivered") {
        return 5;
    }

    return 0;
};


const Orders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getMyOrders();

                setOrders(
                    Array.isArray(data)
                        ? data
                        : data.orders || []
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders."
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrders();

    }, []);


    if (loading) {
        return <Loading />;
    }


    return (
        <div className="page-container orders-page">

            <div className="page-header orders-header">

                <div>

                    <span className="orders-label">
                        YOUR PURCHASES
                    </span>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        View and track all your
                        purchases in one place.
                    </p>

                </div>

                <div className="orders-header-icon">
                    📦
                </div>

            </div>


            <ErrorMessage
                message={error}
            />


            {orders.length === 0 ? (

                <div className="empty-state orders-empty">

                    <div className="orders-empty-icon">
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        Your placed orders will
                        appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Start Shopping →
                    </button>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map(
                        (order) => {

                            const status =
                                order.orderStatus ||
                                "placed";

                            const progress =
                                getProgressStep(
                                    status
                                );

                            const delivery =
                                order.delivery || {};

                            return (
                                <div
                                    className="order-card"
                                    key={
                                        order._id
                                    }
                                >

                                    <div className="order-card-content">

                                        <div className="order-card-heading">

                                            <div>

                                                <span className="order-small-label">
                                                    ORDER
                                                </span>

                                                <h3>
                                                    #
                                                    {
                                                        order._id.slice(
                                                            -8
                                                        )
                                                    }
                                                </h3>

                                            </div>


                                            <div className="order-icon">
                                                📦
                                            </div>

                                        </div>


                                        <div className="order-details">

                                            <div className="order-detail">

                                                <span>
                                                    Status
                                                </span>

                                                <strong
                                                    className={`order-status ${getStatusClass(
                                                        status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        status
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="order-detail">

                                                <span>
                                                    Payment
                                                </span>

                                                <strong>
                                                    {formatStatus(
                                                        order.paymentMethod
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="order-detail">

                                                <span>
                                                    Items
                                                </span>

                                                <strong>
                                                    {
                                                        order
                                                            .items
                                                            ?.length ||
                                                        0
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {status !==
                                            "cancelled" && (
                                            <div className="order-tracking">

                                                <div className="tracking-title">

                                                    <span>
                                                        🚚 Delivery Tracking
                                                    </span>

                                                    <strong>
                                                        {
                                                            formatStatus(
                                                                status
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="tracking-progress">

                                                    <div
                                                        className={`tracking-line ${
                                                            progress >=
                                                            2
                                                                ? "tracking-line-active"
                                                                : ""
                                                        }`}
                                                    />

                                                    <div
                                                        className={`tracking-step ${
                                                            progress >=
                                                            1
                                                                ? "tracking-step-active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            📝
                                                        </span>

                                                        <small>
                                                            Placed
                                                        </small>
                                                    </div>


                                                    <div
                                                        className={`tracking-step ${
                                                            progress >=
                                                            2
                                                                ? "tracking-step-active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            ✓
                                                        </span>

                                                        <small>
                                                            Confirmed
                                                        </small>
                                                    </div>


                                                    <div
                                                        className={`tracking-step ${
                                                            progress >=
                                                            3
                                                                ? "tracking-step-active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            🚚
                                                        </span>

                                                        <small>
                                                            Shipped
                                                        </small>
                                                    </div>


                                                    <div
                                                        className={`tracking-step ${
                                                            progress >=
                                                            4
                                                                ? "tracking-step-active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            📍
                                                        </span>

                                                        <small>
                                                            Out for Delivery
                                                        </small>
                                                    </div>


                                                    <div
                                                        className={`tracking-step ${
                                                            progress >=
                                                            5
                                                                ? "tracking-step-active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            🏠
                                                        </span>

                                                        <small>
                                                            Delivered
                                                        </small>
                                                    </div>

                                                </div>

                                            </div>
                                        )}


                                        {status ===
                                            "cancelled" && (

                                            <div className="order-cancelled-box">

                                                <span>
                                                    ✕
                                                </span>

                                                <div>
                                                    <strong>
                                                        Order Cancelled
                                                    </strong>

                                                    <p>
                                                        This order
                                                        has been
                                                        cancelled.
                                                    </p>
                                                </div>

                                            </div>
                                        )}


                                        <div className="delivery-info">

                                            <div className="delivery-info-header">

                                                <span>
                                                    🚚 DELIVERY INFORMATION
                                                </span>

                                            </div>


                                            <div className="delivery-info-grid">

                                                <div className="delivery-info-item">

                                                    <span>
                                                        Courier
                                                    </span>

                                                    <strong>
                                                        {
                                                            delivery
                                                                .courier ||
                                                            "Not assigned"
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="delivery-info-item">

                                                    <span>
                                                        Tracking Number
                                                    </span>

                                                    <strong>
                                                        {
                                                            delivery
                                                                .trackingNumber ||
                                                            "Not assigned"
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="delivery-info-item">

                                                    <span>
                                                        Expected Delivery
                                                    </span>

                                                    <strong>
                                                        {
                                                            delivery
                                                                .estimatedDelivery
                                                                ? formatDate(
                                                                      delivery
                                                                          .estimatedDelivery
                                                                  )
                                                                : "Not available"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {delivery.deliveryNotes && (

                                                <div className="delivery-notes">

                                                    <span>
                                                        Delivery Note
                                                    </span>

                                                    <p>
                                                        {
                                                            delivery.deliveryNotes
                                                        }
                                                    </p>

                                                </div>
                                            )}

                                        </div>


                                        <div className="order-bottom">

                                            <div>

                                                <span>
                                                    TOTAL AMOUNT
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        order.totalAmount ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/buyer/orders/${order._id}`
                                                    )
                                                }
                                            >
                                                View Details

                                                <span>
                                                    →
                                                </span>

                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
};


export default Orders;