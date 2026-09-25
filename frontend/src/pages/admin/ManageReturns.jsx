import { useEffect, useState } from "react";

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

            const data =
                await getAllReturns();

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


    const handleStatusChange = async (
        id,
        status
    ) => {

        try {

            setActionLoading(true);
            setError("");
            setMessage("");

            await updateReturn(
                id,
                status
            );

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
            <div className="page-container">
                <Loading />
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <span className="dashboard-welcome-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Manage Returns
                    </h1>

                    <p>
                        Review and manage customer
                        return requests.
                    </p>

                </div>

            </div>


            <ErrorMessage
                message={error}
            />


            {message && (

                <div className="success-message">
                    {message}
                </div>

            )}


            {returns.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No Return Requests
                    </h2>

                    <p>
                        There are currently no
                        return requests.
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

                                <div className="return-card-header">

                                    <div>

                                        <span className="dashboard-welcome-label">
                                            RETURN REQUEST
                                        </span>

                                        <h3>
                                            Return #
                                            {item._id.slice(-8)}
                                        </h3>

                                    </div>


                                    <span
                                        className={`status-badge status-${item.status || "pending"}`}
                                    >
                                        {
                                            item.status ||
                                            "pending"
                                        }
                                    </span>

                                </div>


                                <div className="return-details">

                                    <p>

                                        <strong>
                                            Order:
                                        </strong>{" "}

                                        {order._id
                                            ? order._id.slice(-8)
                                            : "N/A"}

                                    </p>


                                    <p>

                                        <strong>
                                            Buyer:
                                        </strong>{" "}

                                        {
                                            buyer.name ||
                                            buyer.email ||
                                            "Unknown"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Reason:
                                        </strong>{" "}

                                        {
                                            item.reason ||
                                            "No reason provided"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {
                                            item.status ||
                                            "pending"
                                        }

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

                                </div>


                                <div className="return-actions">

                                    <button
                                        type="button"
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
                                        type="button"
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
                                        type="button"
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

    );

};


export default ManageReturns;