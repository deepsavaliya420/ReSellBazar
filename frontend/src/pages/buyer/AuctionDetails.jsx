import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAuctionById
} from "../../services/auctionApi";
import {
    createBid,
    getAuctionBids
} from "../../services/bidApi";

const AuctionDetails = () => {
    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(true);
    const [bidLoading, setBidLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);

            const auctionData =
                await getAuctionById(id);

            setAuction(
                auctionData.auction ||
                auctionData
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

    const handleBid = async (e) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid bid amount.");
            return;
        }

        if (
            auction &&
            Number(amount) <=
                Number(auction.currentPrice)
        ) {
            setError(
                `Your bid must be greater than ₹${auction.currentPrice}.`
            );
            return;
        }

        try {
            setBidLoading(true);
            setError("");
            setMessage("");

            await createBid({
                auction: id,
                amount: Number(amount)
            });

            setAmount("");
            setMessage("Bid placed successfully.");

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
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    if (!auction) {
        return (
            <>
                <Navbar />
                <main className="page-container">
                    <h1>Auction Not Found</h1>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="page-container">
                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="auction-details">
                    <h1>
                        {auction.product?.name ||
                            "Auction"}
                    </h1>

                    <p>
                        Seller:{" "}
                        {auction.seller?.name ||
                            "Seller"}
                    </p>

                    <p>
                        Starting Price: ₹
                        {auction.startingPrice}
                    </p>

                    <p>
                        Current Price: ₹
                        {auction.currentPrice}
                    </p>

                    <p>
                        Status: {auction.status}
                    </p>

                    <p>
                        Start:{" "}
                        {new Date(
                            auction.startTime
                        ).toLocaleString("en-IN")}
                    </p>

                    <p>
                        End:{" "}
                        {new Date(
                            auction.endTime
                        ).toLocaleString("en-IN")}
                    </p>

                    {auction.status === "active" && (
                        <form onSubmit={handleBid}>
                            <h2>Place Your Bid</h2>

                            <input
                                type="number"
                                min={
                                    Number(
                                        auction.currentPrice
                                    ) + 1
                                }
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                placeholder={`More than ₹${auction.currentPrice}`}
                                required
                            />

                            <button
                                type="submit"
                                disabled={bidLoading}
                            >
                                {bidLoading
                                    ? "Placing Bid..."
                                    : "Place Bid"}
                            </button>
                        </form>
                    )}

                    <h2>Bid History</h2>

                    {bids.length === 0 ? (
                        <p>No bids yet.</p>
                    ) : (
                        bids.map((bid) => (
                            <div
                                className="bid-card"
                                key={bid._id}
                            >
                                <strong>
                                    ₹{bid.amount}
                                </strong>

                                <p>
                                    Bidder:{" "}
                                    {bid.buyer?.name ||
                                        "Buyer"}
                                </p>

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
                        ))
                    )}

                    <br />

                    <Link to="/auctions">
                        Back to Auctions
                    </Link>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default AuctionDetails;