import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getMyOrders } from "../../services/orderApi";

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyOrders();

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

                    <h1>My Orders</h1>

                    <p>
                        View and track all your purchases
                        in one place.
                    </p>
                </div>

                <div className="orders-header-icon">
                    📦
                </div>
            </div>

            <ErrorMessage message={error} />

            {orders.length === 0 ? (
                <div className="empty-state orders-empty">
                    <div className="orders-empty-icon">
                        📦
                    </div>

                    <h2>No Orders Yet</h2>

                    <p>
                        Your placed orders will appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Start Shopping →
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div
                            className="order-card"
                            key={order._id}
                        >
                            <div className="order-card-content">
                                <div className="order-card-heading">
                                    <div>
                                        <span className="order-small-label">
                                            ORDER
                                        </span>

                                        <h3>
                                            #{order._id.slice(-8)}
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

                                        <strong className="order-status">
                                            {order.orderStatus}
                                        </strong>
                                    </div>

                                    <div className="order-detail">
                                        <span>
                                            Payment
                                        </span>

                                        <strong>
                                            {order.paymentMethod}
                                        </strong>
                                    </div>

                                    <div className="order-detail">
                                        <span>
                                            Items
                                        </span>

                                        <strong>
                                            {order.items?.length || 0}
                                        </strong>
                                    </div>
                                </div>

                                <div className="order-bottom">
                                    <div>
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
                                        onClick={() =>
                                            navigate(
                                                `/buyer/orders/${order._id}`
                                            )
                                        }
                                    >
                                        View Details
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;