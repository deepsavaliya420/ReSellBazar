import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAllReturns,
    updateReturn
} from "../../services/returnApi";

const ManageReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadReturns = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllReturns();

            setReturns(
                Array.isArray(data)
                    ? data
                    : data.returns || []
            );
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

    const handleStatusChange = async (id, status) => {
        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            await updateReturn(id, status);

            setMessage(
                "Return status updated successfully."
            );

            await loadReturns();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update return status."
            );
        } finally {
            setActionLoading(false);
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
                    <h1>Manage Returns</h1>
                    <p>
                        Review and manage customer return
                        requests.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {returns.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Return Requests</h2>
                        <p>
                            There are currently no return
                            requests.
                        </p>
                    </div>
                ) : (
                    <div className="returns-list">
                        {returns.map((item) => {
                            const order =
                                item.order || {};

                            const buyer =
                                item.buyer || {};

                            return (
                                <div
                                    className="return-card"
                                    key={item._id}
                                >
                                    <h3>
                                        Return #
                                        {item._id.slice(-8)}
                                    </h3>

                                    <p>
                                        <strong>
                                            Order:
                                        </strong>{" "}
                                        {order._id
                                            ? order._id.slice(
                                                  -8
                                              )
                                            : "N/A"}
                                    </p>

                                    <p>
                                        <strong>
                                            Buyer:
                                        </strong>{" "}
                                        {buyer.name ||
                                            buyer.email ||
                                            "Unknown"}
                                    </p>

                                    <p>
                                        <strong>
                                            Reason:
                                        </strong>{" "}
                                        {item.reason ||
                                            "No reason provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {item.status ||
                                            "pending"}
                                    </p>

                                    {item.createdAt && (
                                        <p>
                                            <strong>
                                                Created:
                                            </strong>{" "}
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    )}

                                    <div className="return-actions">
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    item._id,
                                                    "approved"
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    item._id,
                                                    "rejected"
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Reject
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    item._id,
                                                    "completed"
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default ManageReturns;