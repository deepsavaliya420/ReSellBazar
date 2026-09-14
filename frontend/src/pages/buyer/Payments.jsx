import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ErrorMessage from "../../components/ErrorMessage";
import {
    createPayment,
    getPayment
} from "../../services/paymentApi";

const Payments = () => {
    const [searchParams] = useSearchParams();

    const [orderId, setOrderId] = useState(
        searchParams.get("order") || ""
    );

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!orderId) {
            setError("Enter an order ID.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getPayment(orderId);

            setPayment(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Payment not found."
            );
            setPayment(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePayment = async () => {
        if (!payment?.order) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await createPayment({
                order: payment.order,
                amount: payment.amount,
                method: "online",
                transactionId: `TXN-${Date.now()}`
            });

            setPayment(
                data.payment || data
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create payment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Payments</h1>
                    <p>Check your order payment information.</p>
                </div>

                <ErrorMessage message={error} />

                <form
                    className="form-card"
                    onSubmit={handleSearch}
                >
                    <input
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) =>
                            setOrderId(e.target.value)
                        }
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Loading..."
                            : "Find Payment"}
                    </button>
                </form>

                {payment && (
                    <div className="order-card">
                        <h2>Payment Details</h2>

                        <p>
                            Order: {payment.order?._id || payment.order}
                        </p>

                        <p>
                            Amount: ₹
                            {Number(
                                payment.amount || 0
                            ).toLocaleString("en-IN")}
                        </p>

                        <p>
                            Method: {payment.method}
                        </p>

                        <p>
                            Status:{" "}
                            <strong>
                                {payment.status}
                            </strong>
                        </p>

                        {payment.status !== "success" && (
                            <button
                                onClick={
                                    handleCreatePayment
                                }
                                disabled={loading}
                            >
                                Create Online Payment
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Payments;