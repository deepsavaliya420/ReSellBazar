import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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

                const data = await getMyOrders();

                const foundOrder = data.find(
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
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Navbar />

                <div className="page-container">
                    <ErrorMessage
                        message={error || "Order not found."}
                    />

                    <button
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        Back to Orders
                    </button>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">
                <button
                    onClick={() => navigate("/orders")}
                >
                    ← Back to Orders
                </button>

                <div className="page-header">
                    <h1>
                        Order #{order._id.slice(-8)}
                    </h1>

                    <p>
                        Status:{" "}
                        <strong>
                            {order.orderStatus}
                        </strong>
                    </p>

                    <p>
                        Payment Method:{" "}
                        <strong>
                            {order.paymentMethod}
                        </strong>
                    </p>

                    <p>
                        Payment Status:{" "}
                        <strong>
                            {order.paymentStatus}
                        </strong>
                    </p>
                </div>

                <div className="order-items">
                    <h2>Order Items</h2>

                    {order.items?.map((item, index) => {
                        const product =
                            item.product || {};

                        return (
                            <div
                                className="order-item"
                                key={
                                    item._id ||
                                    product._id ||
                                    index
                                }
                            >
                                <div>
                                    <h3>
                                        {product.name ||
                                            "Product"}
                                    </h3>

                                    <p>
                                        Quantity:{" "}
                                        {item.quantity}
                                    </p>

                                    <p>
                                        Price: ₹
                                        {Number(
                                            item.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>

                                <strong>
                                    ₹
                                    {(
                                        Number(item.price) *
                                        Number(item.quantity)
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <h2>
                        Total: ₹
                        {Number(
                            order.totalAmount
                        ).toLocaleString("en-IN")}
                    </h2>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderDetails;