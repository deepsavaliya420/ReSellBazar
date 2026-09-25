import { useEffect, useState } from "react";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAllOrders,
    updateOrderStatus,
    updateDelivery
} from "../../services/orderApi";


const statuses = [
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled"
];


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


const ManageOrders = () => {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [savingDelivery, setSavingDelivery] =
        useState(null);

    const [deliveryForms, setDeliveryForms] =
        useState({});


    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAllOrders();

            const orderList =
                Array.isArray(data)
                    ? data
                    : data.orders || [];

            setOrders(orderList);

            const formData = {};

            orderList.forEach((order) => {

                formData[order._id] = {
                    courier:
                        order.delivery?.courier ||
                        "",

                    trackingNumber:
                        order.delivery?.trackingNumber ||
                        "",

                    estimatedDelivery:
                        order.delivery?.estimatedDelivery
                            ? new Date(
                                order.delivery.estimatedDelivery
                            )
                                .toISOString()
                                .slice(0, 16)
                            : "",

                    deliveryNotes:
                        order.delivery?.deliveryNotes ||
                        ""
                };

            });

            setDeliveryForms(formData);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load orders."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadOrders();
    }, []);


    const handleStatus = async (
        id,
        status
    ) => {

        try {

            setError("");
            setMessage("");

            const data =
                await updateOrderStatus(
                    id,
                    status
                );

            const updated =
                data.order;

            setOrders((current) =>
                current.map((order) =>
                    order._id === id
                        ? updated
                        : order
                )
            );

            setMessage(
                "Order status updated successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update order."
            );

        }

    };


    const handleDeliveryChange = (
        orderId,
        field,
        value
    ) => {

        setDeliveryForms((current) => ({

            ...current,

            [orderId]: {

                ...current[orderId],

                [field]: value

            }

        }));

    };


    const handleSaveDelivery = async (
        orderId
    ) => {

        try {

            setSavingDelivery(orderId);

            setError("");
            setMessage("");

            const form =
                deliveryForms[orderId];

            const data =
                await updateDelivery(
                    orderId,
                    {
                        courier:
                            form.courier,

                        trackingNumber:
                            form.trackingNumber,

                        estimatedDelivery:
                            form.estimatedDelivery,

                        deliveryNotes:
                            form.deliveryNotes
                    }
                );

            const updated =
                data.order;

            setOrders((current) =>
                current.map((order) =>
                    order._id === orderId
                        ? updated
                        : order
                )
            );

            setMessage(
                "Delivery information updated successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update delivery information."
            );

        } finally {

            setSavingDelivery(null);

        }

    };


    const getStatusClass = (status) => {

        if (status === "delivered") {
            return "status-active";
        }

        if (status === "cancelled") {
            return "status-ended";
        }

        if (
            status === "shipped" ||
            status === "out_for_delivery"
        ) {
            return "status-upcoming";
        }

        return "status-other";
    };


    if (loading) {

        return (
            <div className="page-container">
                <Loading />
            </div>
        );

    }


    return (

        <main className="page-container">

            <div className="page-header">

                <div>

                    <span className="dashboard-welcome-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        🚚 Delivery Management
                    </h1>

                    <p>
                        Manage orders, delivery partners,
                        tracking details and delivery status.
                    </p>

                </div>

            </div>


            {error && (
                <ErrorMessage
                    message={error}
                />
            )}


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {orders.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No Orders Found
                    </h2>

                    <p>
                        There are currently no
                        customer orders.
                    </p>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => {

                        const form =
                            deliveryForms[order._id] || {
                                courier: "",
                                trackingNumber: "",
                                estimatedDelivery: "",
                                deliveryNotes: ""
                            };


                        return (

                            <div
                                className="order-card"
                                key={order._id}
                            >

                                <div className="order-card-content">

                                    <div className="order-card-heading">

                                        <div>

                                            <h3>
                                                Order #
                                                {order._id.slice(-8)}
                                            </h3>

                                            <p>
                                                Buyer:{" "}
                                                <strong>
                                                    {
                                                        order.buyer?.name ||
                                                        "Unknown Buyer"
                                                    }
                                                </strong>
                                            </p>

                                            <p>
                                                Email:{" "}
                                                {
                                                    order.buyer?.email ||
                                                    "-"
                                                }
                                            </p>

                                        </div>


                                        <span
                                            className={`status-badge ${getStatusClass(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {
                                                formatStatus(
                                                    order.orderStatus
                                                )
                                            }
                                        </span>

                                    </div>


                                    <div className="order-details">

                                        <p>
                                            <strong>
                                                Total:
                                            </strong>{" "}
                                            ₹
                                            {Number(
                                                order.totalAmount || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Payment:
                                            </strong>{" "}
                                            {
                                                order.paymentMethod
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Payment Status:
                                            </strong>{" "}
                                            {
                                                order.paymentStatus ||
                                                "pending"
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Items:
                                            </strong>{" "}
                                            {
                                                order.items?.length ||
                                                0
                                            }
                                        </p>

                                    </div>


                                    <div
                                        style={{
                                            marginTop: "20px"
                                        }}
                                    >

                                        <label>
                                            <strong>
                                                Order Status
                                            </strong>
                                        </label>


                                        <select
                                            value={
                                                order.orderStatus
                                            }
                                            onChange={(event) =>
                                                handleStatus(
                                                    order._id,
                                                    event.target.value
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "10px"
                                            }}
                                        >

                                            {statuses.map(
                                                (status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {
                                                            formatStatus(
                                                                status
                                                            )
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div
                                        className="form-section"
                                        style={{
                                            marginTop: "25px"
                                        }}
                                    >

                                        <h3>
                                            🚚 Delivery Information
                                        </h3>


                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                                gap: "15px"
                                            }}
                                        >

                                            <div>

                                                <label>
                                                    Courier / Delivery Partner
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        form.courier
                                                    }
                                                    onChange={(event) =>
                                                        handleDeliveryChange(
                                                            order._id,
                                                            "courier",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Delhivery"
                                                />

                                            </div>


                                            <div>

                                                <label>
                                                    Tracking Number
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        form.trackingNumber
                                                    }
                                                    onChange={(event) =>
                                                        handleDeliveryChange(
                                                            order._id,
                                                            "trackingNumber",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Enter tracking number"
                                                />

                                            </div>


                                            <div>

                                                <label>
                                                    Estimated Delivery
                                                </label>

                                                <input
                                                    type="datetime-local"
                                                    value={
                                                        form.estimatedDelivery
                                                    }
                                                    onChange={(event) =>
                                                        handleDeliveryChange(
                                                            order._id,
                                                            "estimatedDelivery",
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>


                                        <div
                                            style={{
                                                marginTop: "15px"
                                            }}
                                        >

                                            <label>
                                                Delivery Notes
                                            </label>

                                            <textarea
                                                value={
                                                    form.deliveryNotes
                                                }
                                                onChange={(event) =>
                                                    handleDeliveryChange(
                                                        order._id,
                                                        "deliveryNotes",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Add delivery instructions or notes"
                                                rows="3"
                                            />

                                        </div>


                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{
                                                marginTop: "15px"
                                            }}
                                            disabled={
                                                savingDelivery ===
                                                order._id
                                            }
                                            onClick={() =>
                                                handleSaveDelivery(
                                                    order._id
                                                )
                                            }
                                        >

                                            {
                                                savingDelivery ===
                                                order._id
                                                    ? "Saving..."
                                                    : "Save Delivery Information"
                                            }

                                        </button>

                                    </div>


                                    {order.delivery && (

                                        <div
                                            style={{
                                                marginTop: "20px",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                background: "#f8fafc"
                                            }}
                                        >

                                            <h4>
                                                Delivery Timeline
                                            </h4>


                                            <p>
                                                <strong>
                                                    Shipped:
                                                </strong>{" "}

                                                {
                                                    order.delivery
                                                        .shippedAt

                                                    ? new Date(
                                                        order.delivery
                                                            .shippedAt
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )

                                                    : "Not shipped"
                                                }

                                            </p>


                                            <p>
                                                <strong>
                                                    Out for Delivery:
                                                </strong>{" "}

                                                {
                                                    order.delivery
                                                        .outForDeliveryAt

                                                    ? new Date(
                                                        order.delivery
                                                            .outForDeliveryAt
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )

                                                    : "Not out for delivery"
                                                }

                                            </p>


                                            <p>
                                                <strong>
                                                    Delivered:
                                                </strong>{" "}

                                                {
                                                    order.delivery
                                                        .deliveredAt

                                                    ? new Date(
                                                        order.delivery
                                                            .deliveredAt
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )

                                                    : "Not delivered"
                                                }

                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </main>

    );

};


export default ManageOrders;