import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getAuctions } from "../../services/auctionApi";

import "../../styles/auction.css";

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAuctions = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAuctions();

            const list =
                Array.isArray(data)
                    ? data
                    : data.auctions || [];

            setAuctions(list);
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

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString(
            "en-IN"
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

    const getStatusClass = (status) => {
        if (status === "active") {
            return "auction-status-active";
        }

        if (status === "upcoming") {
            return "auction-status-upcoming";
        }

        if (status === "ended") {
            return "auction-status-ended";
        }

        return "auction-status-cancelled";
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="auction-page">

            <section className="auction-hero">

                <div className="auction-hero-content">

                    <span className="auction-hero-badge">
                        🔨 LIVE MARKETPLACE
                    </span>

                    <h1>
                        Discover Amazing Auctions
                    </h1>

                    <p>
                        Bid on products you love,
                        compete with other buyers,
                        and grab the best deals.
                    </p>

                    <div className="auction-hero-stats">

                        <div>
                            <strong>
                                {auctions.length}
                            </strong>

                            <span>
                                Total Auctions
                            </span>
                        </div>

                        <div>
                            <strong>
                                {
                                    auctions.filter(
                                        (auction) =>
                                            auction.status ===
                                            "active"
                                    ).length
                                }
                            </strong>

                            <span>
                                Live Auctions
                            </span>
                        </div>

                        <div>
                            <strong>
                                {
                                    auctions.filter(
                                        (auction) =>
                                            auction.status ===
                                            "upcoming"
                                    ).length
                                }
                            </strong>

                            <span>
                                Upcoming
                            </span>
                        </div>

                    </div>

                </div>

                <div className="auction-hero-icon">
                    🔨
                </div>

            </section>

            <section className="auction-content">

                <div className="auction-section-header">

                    <div>
                        <h2>
                            Available Auctions
                        </h2>

                        <p>
                            Choose an auction and
                            place your bid.
                        </p>
                    </div>

                </div>

                <ErrorMessage message={error} />

                {auctions.length === 0 ? (

                    <div className="auction-empty">

                        <div className="auction-empty-icon">
                            🔨
                        </div>

                        <h2>
                            No Auctions Available
                        </h2>

                        <p>
                            There are currently no
                            auctions available.
                            Please check again later.
                        </p>

                        <Link
                            to="/products"
                            className="auction-primary-button"
                        >
                            Browse Products
                        </Link>

                    </div>

                ) : (

                    <div className="auction-grid">

                        {auctions.map((auction) => {

                            const image =
                                auction.product
                                    ?.images?.[0];

                            return (
                                <article
                                    className="auction-card"
                                    key={auction._id}
                                >

                                    <div className="auction-card-image">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={
                                                    auction.product
                                                        ?.name ||
                                                    "Auction product"
                                                }
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";

                                                    event.currentTarget.nextElementSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                        ) : null}

                                        <div
                                            className="auction-image-fallback"
                                            style={{
                                                display: image
                                                    ? "none"
                                                    : "flex"
                                            }}
                                        >
                                            🛍️
                                        </div>

                                        <span
                                            className={`auction-status ${getStatusClass(
                                                auction.status
                                            )}`}
                                        >
                                            {auction.status}
                                        </span>

                                    </div>

                                    <div className="auction-card-body">

                                        <h3>
                                            {auction.product
                                                ?.name ||
                                                "Auction Product"}
                                        </h3>

                                        <p className="auction-seller">
                                            Seller:{" "}
                                            <strong>
                                                {auction.seller
                                                    ?.name ||
                                                    "Seller"}
                                            </strong>
                                        </p>

                                        <div className="auction-price-row">

                                            <div>
                                                <span>
                                                    Starting Price
                                                </span>

                                                <strong>
                                                    ₹
                                                    {formatPrice(
                                                        auction.startingPrice
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Current Bid
                                                </span>

                                                <strong className="auction-current-price">
                                                    ₹
                                                    {formatPrice(
                                                        auction.currentPrice
                                                    )}
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="auction-time">

                                            <div>
                                                <span>
                                                    🟢 Starts
                                                </span>

                                                <p>
                                                    {formatDate(
                                                        auction.startTime
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <span>
                                                    🔴 Ends
                                                </span>

                                                <p>
                                                    {formatDate(
                                                        auction.endTime
                                                    )}
                                                </p>
                                            </div>

                                        </div>

                                        <Link
                                            to={`/buyer/auctions/${auction._id}`}
                                            className="auction-view-button"
                                        >
                                            {auction.status ===
                                            "active"
                                                ? "🔨 Place Bid"
                                                : "View Auction →"}
                                        </Link>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                )}

            </section>

        </main>
    );
};

export default Auctions;