import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAllOrders,
    updateOrderStatus
} from "../../services/orderApi";

const statuses = [
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled"
];

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        try {
            const data = await getAllOrders();

            setOrders(
                Array.isArray(data) ? data : []
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

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatus = async (id, status) => {
        try {
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
                        ? {
                              ...order,
                              orderStatus:
                                  updated.orderStatus
                          }
                        : order
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update order."
            );
        }
    };

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
                    <h1>Manage Orders</h1>
                </div>

                <ErrorMessage message={error} />

                <div className="orders-list">
                    {orders.map((order) => (
                        <div
                            className="order-card"
                            key={order._id}
                        >
                            <h3>
                                Order #
                                {order._id.slice(-8)}
                            </h3>

                            <p>
                                Buyer:{" "}
                                {order.buyer?.name}
                            </p>

                            <p>
                                Total: ₹
                                {Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                            <p>
                                Payment:{" "}
                                {order.paymentMethod}
                            </p>

                            <select
                                value={
                                    order.orderStatus
                                }
                                onChange={(e) =>
                                    handleStatus(
                                        order._id,
                                        e.target.value
                                    )
                                }
                            >
                                {statuses.map(
                                    (status) => (
                                        <option
                                            key={
                                                status
                                            }
                                            value={
                                                status
                                            }
                                        >
                                            {status}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ManageOrders;