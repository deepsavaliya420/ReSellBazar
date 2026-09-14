import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAuctions,
    endAuction
} from "../../services/auctionApi";

const ManageAuction = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadAuctions = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAuctions();

            setAuctions(
                Array.isArray(data)
                    ? data
                    : data.auctions || []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load auctions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuctions();
    }, []);

    const handleEndAuction = async (id) => {
        const confirmEnd = window.confirm(
            "Are you sure you want to end this auction?"
        );

        if (!confirmEnd) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await endAuction(id);

            setMessage("Auction ended successfully.");

            await loadAuctions();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to end auction."
            );
        }
    };

    const getStatusClass = (status) => {
        if (status === "active") {
            return "status-active";
        }

        if (status === "ended") {
            return "status-ended";
        }

        return "status-other";
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="page-container">
                    <Loading />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Manage Auctions</h1>
                        <p>
                            View and manage all product auctions.
                        </p>
                    </div>
                </div>

                {error && (
                    <ErrorMessage message={error} />
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {auctions.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Auctions Found</h2>
                        <p>
                            There are currently no auctions
                            available.
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Seller</th>
                                    <th>Starting Price</th>
                                    <th>Current Price</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {auctions.map((auction) => (
                                    <tr key={auction._id}>
                                        <td>
                                            <div className="table-product">
                                                {auction.product?.images?.[0] && (
                                                    <img
                                                        src={
                                                            auction.product.images[0]
                                                        }
                                                        alt={
                                                            auction.product.name ||
                                                            "Product"
                                                        }
                                                    />
                                                )}

                                                <span>
                                                    {auction.product?.name ||
                                                        "Unknown Product"}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            {auction.seller?.name ||
                                                "Unknown Seller"}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                auction.startingPrice || 0
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                auction.currentPrice || 0
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            {auction.startDate
                                                ? new Date(
                                                      auction.startDate
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            {auction.endDate
                                                ? new Date(
                                                      auction.endDate
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    auction.status
                                                )}`}
                                            >
                                                {auction.status ||
                                                    "unknown"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="table-actions">
                                                <Link
                                                    to={`/auctions/${auction._id}`}
                                                    className="btn btn-secondary"
                                                >
                                                    View
                                                </Link>

                                                {auction.status ===
                                                    "active" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() =>
                                                            handleEndAuction(
                                                                auction._id
                                                            )
                                                        }
                                                    >
                                                        End Auction
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
};

export default ManageAuction;