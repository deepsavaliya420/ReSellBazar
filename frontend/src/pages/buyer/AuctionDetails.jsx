import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAuctionById
} from "../../services/auctionApi";

import {
    createBid,
    getAuctionBids
} from "../../services/bidApi";

import "../../styles/auction.css";

const AuctionDetails = () => {
    const { id } = useParams();

    const [auction, setAuction] =
        useState(null);

    const [bids, setBids] =
        useState([]);

    const [amount, setAmount] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [bidLoading, setBidLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const auctionData =
                await getAuctionById(id);

            const auctionResult =
                auctionData.auction ||
                auctionData;

            setAuction(
                auctionResult
            );

            const bidData =
                await getAuctionBids(id);

            setBids(
                Array.isArray(bidData)
                    ? bidData
                    : bidData.bids || []
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load auction."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleBid = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (
            !amount ||
            Number(amount) <= 0
        ) {
            setError(
                "Enter a valid bid amount."
            );
            return;
        }

        if (
            auction &&
            Number(amount) <=
                Number(
                    auction.currentPrice
                )
        ) {
            setError(
                `Your bid must be greater than ₹${Number(
                    auction.currentPrice
                ).toLocaleString("en-IN")}.`
            );
            return;
        }

        try {
            setBidLoading(true);

            await createBid({
                auction: id,
                amount: Number(amount)
            });

            setAmount("");

            setMessage(
                "Bid placed successfully."
            );

            await loadData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to place bid."
            );
        } finally {
            setBidLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="auction-page">
                <Loading />
            </main>
        );
    }

    if (!auction) {
        return (
            <main className="auction-page">

                <div className="auction-empty">

                    <div className="auction-empty-icon">
                        🏷️
                    </div>

                    <h2>
                        Auction Not Found
                    </h2>

                    <p>
                        The auction you are
                        looking for does not
                        exist.
                    </p>

                    <Link
                        to="/buyer/auctions"
                        className="auction-create-button"
                    >
                        Back to Auctions
                    </Link>

                </div>

            </main>
        );
    }

    const product =
        auction.product || {};

    const image =
        product.images?.length > 0
            ? product.images[0]
            : null;

    const isActive =
        auction.status === "active";

    const isUpcoming =
        auction.status === "upcoming";

    const isEnded =
        auction.status === "ended";

    return (
        <main className="auction-page">

            <div className="auction-details">

                <Link
                    to="/buyer/auctions"
                    className="auction-back-link"
                >
                    ← Back to Auctions
                </Link>

                <ErrorMessage
                    message={error}
                />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="auction-details-card">

                    <div className="auction-details-image">

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
                            className="auction-image-fallback"
                            style={{
                                display: image
                                    ? "none"
                                    : "flex"
                            }}
                        >
                            🏷️
                            <span>
                                No Image
                            </span>
                        </div>

                    </div>

                    <div className="auction-details-info">

                        <span className="auction-eyebrow">
                            LIVE AUCTION
                        </span>

                        <h1>
                            {product.name ||
                                "Auction Product"}
                        </h1>

                        <p className="auction-seller">
                            Seller:{" "}
                            <strong>
                                {auction.seller?.name ||
                                    "Seller"}
                            </strong>
                        </p>

                        <div className="auction-status-row">

                            <span
                                className={`auction-status ${
                                    isActive
                                        ? "auction-status-live"
                                        : isUpcoming
                                        ? "auction-status-upcoming"
                                        : isEnded
                                        ? "auction-status-ended"
                                        : "auction-status-cancelled"
                                }`}
                            >
                                {isActive
                                    ? "🔴 Live"
                                    : isUpcoming
                                    ? "⏳ Upcoming"
                                    : isEnded
                                    ? "✓ Ended"
                                    : "✕ Cancelled"}
                            </span>

                        </div>

                        <div className="auction-detail-price">

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

                        <div className="auction-time-info">

                            <div>
                                <span>
                                    🕐 Starts
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
                                    ⏰ Ends
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

                    </div>

                </div>

                {isActive && (

                    <div className="bid-form">

                        <div>
                            <span className="auction-eyebrow">
                                PLACE YOUR BID
                            </span>

                            <h2>
                                Make Your Offer
                            </h2>

                            <p>
                                Enter an amount
                                higher than the
                                current bid.
                            </p>
                        </div>

                        <form
                            onSubmit={handleBid}
                        >

                            <div className="auction-money-input">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    min={
                                        Number(
                                            auction.currentPrice
                                        ) + 1
                                    }
                                    step="1"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(
                                            event.target.value
                                        )
                                    }
                                    placeholder={`More than ₹${Number(
                                        auction.currentPrice
                                    ).toLocaleString(
                                        "en-IN"
                                    )}`}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="auction-primary-button"
                                disabled={
                                    bidLoading
                                }
                            >
                                {bidLoading
                                    ? "Placing Bid..."
                                    : "🔨 Place Bid"}
                            </button>

                        </form>

                    </div>

                )}

                {isUpcoming && (

                    <div className="auction-form-info">

                        <span>
                            ⏳
                        </span>

                        <div>
                            <strong>
                                Auction has not started
                            </strong>

                            <p>
                                Bidding will be
                                available once
                                the auction starts.
                            </p>
                        </div>

                    </div>

                )}

                {isEnded && (

                    <div className="auction-form-info">

                        <span>
                            🏁
                        </span>

                        <div>
                            <strong>
                                Auction has ended
                            </strong>

                            <p>
                                No more bids can
                                be placed for this
                                auction.
                            </p>
                        </div>

                    </div>

                )}

                <section className="bid-history">

                    <div className="auctions-section-title">

                        <div>
                            <span className="auction-eyebrow">
                                AUCTION ACTIVITY
                            </span>

                            <h2>
                                Bid History
                            </h2>
                        </div>

                        <span>
                            {bids.length}{" "}
                            {bids.length === 1
                                ? "Bid"
                                : "Bids"}
                        </span>

                    </div>

                    {bids.length === 0 ? (

                        <div className="auction-empty">

                            <div className="auction-empty-icon">
                                💰
                            </div>

                            <h3>
                                No Bids Yet
                            </h3>

                            <p>
                                Be the first buyer
                                to place a bid.
                            </p>

                        </div>

                    ) : (

                        <div>

                            {bids.map((bid, index) => (

                                <div
                                    className="bid-card"
                                    key={bid._id}
                                >

                                    <div>

                                        <span>
                                            #{index + 1}
                                        </span>

                                        <strong>
                                            {bid.buyer?.name ||
                                                "Buyer"}
                                        </strong>

                                    </div>

                                    <div>

                                        <strong>
                                            ₹
                                            {Number(
                                                bid.amount ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <small>
                                            {bid.createdAt
                                                ? new Date(
                                                      bid.createdAt
                                                  ).toLocaleString(
                                                      "en-IN"
                                                  )
                                                : ""}
                                        </small>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
};

export default AuctionDetails;