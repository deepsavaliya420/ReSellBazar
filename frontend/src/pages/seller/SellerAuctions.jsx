import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAuctions,
    endAuction
} from "../../services/auctionApi";

import { useAuth } from "../../context/AuthContext";

import "../../styles/auction.css";

const SellerAuctions = () => {
    const { user } = useAuth();

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAuctions = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAuctions();

            const list = Array.isArray(data)
                ? data
                : data.auctions || [];

            const sellerId =
                user?.id || user?._id;

            const sellerAuctions = list.filter(
                (auction) => {
                    const seller =
                        auction.seller;

                    const sellerIdFromAuction =
                        typeof seller === "object"
                            ? seller?._id
                            : seller;

                    return (
                        sellerIdFromAuction ===
                        sellerId
                    );
                }
            );

            setAuctions(sellerAuctions);
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
        if (user) {
            loadAuctions();
        }
    }, [user]);

    const handleEnd = async (id) => {
        const confirmEnd = window.confirm(
            "Are you sure you want to end this auction?"
        );

        if (!confirmEnd) {
            return;
        }

        try {
            setError("");

            await endAuction(id);

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
            return "auction-status-live";
        }

        if (status === "upcoming") {
            return "auction-status-upcoming";
        }

        if (status === "ended") {
            return "auction-status-ended";
        }

        return "auction-status-cancelled";
    };

    const getStatusText = (status) => {
        if (status === "active") {
            return "🔴 Live";
        }

        if (status === "upcoming") {
            return "⏳ Upcoming";
        }

        if (status === "ended") {
            return "✓ Ended";
        }

        if (status === "cancelled") {
            return "✕ Cancelled";
        }

        return status;
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="page-container auction-page">

            <div className="auction-page-header">

                <div>
                    <span className="auction-eyebrow">
                        SELLER CENTER
                    </span>

                    <h1>
                        My Auctions
                    </h1>

                    <p>
                        Manage your auctions,
                        monitor bids and track
                        your auction results.
                    </p>
                </div>

                <Link
                    to="/seller/auctions/add"
                    className="auction-create-button"
                >
                    + Create Auction
                </Link>

            </div>

            <ErrorMessage message={error} />

            {auctions.length === 0 ? (

                <div className="auction-empty">

                    <div className="auction-empty-icon">
                        🏷️
                    </div>

                    <h2>
                        No Auctions Yet
                    </h2>

                    <p>
                        You haven't created any
                        auctions yet. Start selling
                        your products through
                        auctions.
                    </p>

                    <Link
                        to="/seller/auctions/add"
                        className="auction-create-button"
                    >
                        Create Your First Auction
                    </Link>

                </div>

            ) : (

                <div className="seller-auction-grid">

                    {auctions.map((auction) => {

                        const product =
                            auction.product || {};

                        const image =
                            product.images?.length > 0
                                ? product.images[0]
                                : null;

                        return (
                            <div
                                className="seller-auction-card"
                                key={auction._id}
                            >

                                <div className="seller-auction-image">

                                    {image ? (
                                        <img
                                            src={image}
                                            alt={
                                                product.name ||
                                                "Auction Product"
                                            }
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";

                                                if (
                                                    event.currentTarget
                                                        .nextElementSibling
                                                ) {
                                                    event.currentTarget
                                                        .nextElementSibling
                                                        .style.display =
                                                        "flex";
                                                }
                                            }}
                                        />
                                    ) : null}

                                    <div
                                        className="seller-auction-image-fallback"
                                        style={{
                                            display: image
                                                ? "none"
                                                : "flex"
                                        }}
                                    >
                                        🏷️
                                    </div>

                                    <span
                                        className={`seller-auction-status ${getStatusClass(
                                            auction.status
                                        )}`}
                                    >
                                        {getStatusText(
                                            auction.status
                                        )}
                                    </span>

                                </div>

                                <div className="seller-auction-content">

                                    <span className="seller-auction-label">
                                        AUCTION ITEM
                                    </span>

                                    <h2>
                                        {product.name ||
                                            "Product"}
                                    </h2>

                                    <div className="seller-auction-price-box">

                                        <div>
                                            <span>
                                                Starting Price
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    auction.startingPrice ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Current Bid
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    auction.currentPrice ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="seller-auction-info">

                                        <div>
                                            <span>
                                                🕐 Start
                                            </span>

                                            <strong>
                                                {auction.startTime
                                                    ? new Date(
                                                          auction.startTime
                                                      ).toLocaleString(
                                                          "en-IN"
                                                      )
                                                    : "Not available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                ⏰ End
                                            </span>

                                            <strong>
                                                {auction.endTime
                                                    ? new Date(
                                                          auction.endTime
                                                      ).toLocaleString(
                                                          "en-IN"
                                                      )
                                                    : "Not available"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="seller-auction-winner">

                                        <span>
                                            🏆 Winner
                                        </span>

                                        <strong>
                                            {auction.winner?.name ||
                                                "No winner yet"}
                                        </strong>

                                    </div>

                                    <div className="seller-auction-actions">

                                        <Link
                                            to={`/buyer/auctions/${auction._id}`}
                                            className="auction-view-button"
                                        >
                                            View Auction →
                                        </Link>

                                        {auction.status !== "ended" &&
                                            auction.status !== "cancelled" && (
                                                <button
                                                    className="auction-end-button"
                                                    onClick={() =>
                                                        handleEnd(
                                                            auction._id
                                                        )
                                                    }
                                                >
                                                    End Auction
                                                </button>
                                            )}

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </main>
    );
};

export default SellerAuctions;