import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getMyOrders } from "../../services/orderApi";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyOrders();

                const orders = Array.isArray(data)
                    ? data
                    : data.orders || [];

                const foundOrder = orders.find(
                    (item) => item._id === id
                );

                if (!foundOrder) {
                    setError("Order not found.");
                } else {
                    setOrder(foundOrder);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="order-details-page">
                <Loading />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">

                    <div className="order-error-card">
                        <div className="order-error-icon">
                            ⚠️
                        </div>

                        <ErrorMessage
                            message={
                                error ||
                                "Order not found."
                            }
                        />

                        <button
                            onClick={() =>
                                navigate(
                                    "/buyer/orders"
                                )
                            }
                        >
                            ← Back to Orders
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">

            <div className="order-details-container">

                <button
                    className="order-back-button"
                    onClick={() =>
                        navigate("/buyer/orders")
                    }
                >
                    ← Back to Orders
                </button>

                <div className="order-details-header">

                    <div>
                        <span className="order-details-label">
                            ORDER DETAILS
                        </span>

                        <h1>
                            Order #
                            {order._id.slice(-8)}
                        </h1>

                        <p>
                            Here is the complete
                            information about your order.
                        </p>
                    </div>

                    <div className="order-details-header-icon">
                        📦
                    </div>

                </div>

                <div className="order-status-grid">

                    <div className="order-status-card">
                        <div className="order-status-icon">
                            📦
                        </div>

                        <div>
                            <span>
                                ORDER STATUS
                            </span>

                            <strong>
                                {order.orderStatus}
                            </strong>
                        </div>
                    </div>

                    <div className="order-status-card">
                        <div className="order-status-icon">
                            💳
                        </div>

                        <div>
                            <span>
                                PAYMENT METHOD
                            </span>

                            <strong>
                                {order.paymentMethod}
                            </strong>
                        </div>
                    </div>

                    <div className="order-status-card">
                        <div className="order-status-icon">
                            ✅
                        </div>

                        <div>
                            <span>
                                PAYMENT STATUS
                            </span>

                            <strong>
                                {order.paymentStatus}
                            </strong>
                        </div>
                    </div>

                </div>

                <div className="order-details-content">

                    <section className="order-items-section">

                        <div className="order-section-header">

                            <div>
                                <span>
                                    YOUR PURCHASE
                                </span>

                                <h2>
                                    Order Items
                                </h2>
                            </div>

                            <div className="order-item-count">
                                {order.items?.length || 0}{" "}
                                {order.items?.length === 1
                                    ? "Item"
                                    : "Items"}
                            </div>

                        </div>

                        <div className="order-items-list">

                            {order.items?.map(
                                (item, index) => {
                                    const product =
                                        item.product || {};

                                    const price =
                                        Number(
                                            item.price || 0
                                        );

                                    const quantity =
                                        Number(
                                            item.quantity || 0
                                        );

                                    const subtotal =
                                        price *
                                        quantity;

                                    return (
                                        <div
                                            className="order-item"
                                            key={
                                                item._id ||
                                                product._id ||
                                                index
                                            }
                                        >

                                            <div className="order-item-image">
                                                {product.images
                                                    ?.length ? (
                                                    <img
                                                        src={
                                                            product
                                                                .images[0]
                                                        }
                                                        alt={
                                                            product.name ||
                                                            "Product"
                                                        }
                                                    />
                                                ) : (
                                                    <span>
                                                        📦
                                                    </span>
                                                )}
                                            </div>

                                            <div className="order-item-info">

                                                <span>
                                                    PRODUCT
                                                </span>

                                                <h3>
                                                    {product.name ||
                                                        "Product"}
                                                </h3>

                                                <p>
                                                    Quantity:{" "}
                                                    {quantity}
                                                </p>

                                            </div>

                                            <div className="order-item-pricing">

                                                <span>
                                                    ₹
                                                    {price.toLocaleString(
                                                        "en-IN"
                                                    )}{" "}
                                                    ×{" "}
                                                    {quantity}
                                                </span>

                                                <strong>
                                                    ₹
                                                    {subtotal.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>

                    <aside className="order-total-card">

                        <div className="order-total-header">
                            <span>
                                ORDER SUMMARY
                            </span>

                            <h2>
                                Payment Summary
                            </h2>
                        </div>

                        <div className="order-total-row">
                            <span>
                                Items
                            </span>

                            <strong>
                                {order.items?.length || 0}
                            </strong>
                        </div>

                        <div className="order-total-row">
                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {order.paymentMethod}
                            </strong>
                        </div>

                        <div className="order-total-row">
                            <span>
                                Payment Status
                            </span>

                            <strong className="payment-status">
                                {order.paymentStatus}
                            </strong>
                        </div>

                        <div className="order-total-divider" />

                        <div className="order-grand-total">
                            <span>
                                TOTAL AMOUNT
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>

                        <button
                            className="order-back-orders-button"
                            onClick={() =>
                                navigate(
                                    "/buyer/orders"
                                )
                            }
                        >
                            Back to Orders
                            <span>→</span>
                        </button>

                    </aside>

                </div>

            </div>

        </div>
    );
};

export default OrderDetails;