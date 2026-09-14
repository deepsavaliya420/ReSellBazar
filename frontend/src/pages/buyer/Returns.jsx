import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getMyReturns,
    createReturn
} from "../../services/returnApi";

const Returns = () => {
    const [returns, setReturns] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadReturns = async () => {
        try {
            setLoading(true);

            const data = await getMyReturns();

            setReturns(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load returns."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReturns();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await createReturn({
                order: orderId,
                reason
            });

            setOrderId("");
            setReason("");

            await loadReturns();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit return."
            );
        } finally {
            setSaving(false);
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
                    <h1>Returns</h1>
                    <p>Request and track product returns.</p>
                </div>

                <ErrorMessage message={error} />

                <div className="form-card">
                    <h2>Request Return</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Order ID"
                            value={orderId}
                            onChange={(e) =>
                                setOrderId(e.target.value)
                            }
                            required
                        />

                        <textarea
                            placeholder="Reason for return"
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                            required
                        />

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Submitting..."
                                : "Submit Return"}
                        </button>
                    </form>
                </div>

                <div className="section">
                    <h2>My Return Requests</h2>

                    {returns.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Return Requests</h3>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {returns.map((item) => (
                                <div
                                    className="order-card"
                                    key={item._id}
                                >
                                    <h3>
                                        Return #
                                        {item._id.slice(-8)}
                                    </h3>

                                    <p>
                                        Order:{" "}
                                        {item.order?._id ||
                                            item.order}
                                    </p>

                                    <p>
                                        Reason: {item.reason}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        <strong>
                                            {item.status}
                                        </strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Returns;