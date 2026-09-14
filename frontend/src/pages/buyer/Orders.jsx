import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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

                setOrders(Array.isArray(data) ? data : []);
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
        return (
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>My Orders</h1>
                    <p>View and track your purchases.</p>
                </div>

                <ErrorMessage message={error} />

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Orders Yet</h2>

                        <p>
                            Your placed orders will appear here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div
                                className="order-card"
                                key={order._id}
                            >
                                <div>
                                    <h3>
                                        Order #
                                        {order._id.slice(-8)}
                                    </h3>

                                    <p>
                                        Status:{" "}
                                        <strong>
                                            {order.orderStatus}
                                        </strong>
                                    </p>

                                    <p>
                                        Payment:{" "}
                                        {order.paymentMethod}
                                    </p>

                                    <p>
                                        Items:{" "}
                                        {order.items?.length || 0}
                                    </p>

                                    <h3>
                                        Total: ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </h3>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order._id}`
                                        )
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Orders;