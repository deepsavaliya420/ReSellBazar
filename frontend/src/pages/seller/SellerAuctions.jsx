import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAuctions,
    endAuction
} from "../../services/auctionApi";
import { useAuth } from "../../context/AuthContext";

const SellerAuctions = () => {
    const { user } = useAuth();

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAuctions = async () => {
        try {
            const data = await getAuctions();

            const list =
                Array.isArray(data)
                    ? data
                    : [];

            const sellerAuctions =
                list.filter((auction) => {
                    const seller =
                        auction.seller;

                    const sellerId =
                        typeof seller ===
                        "object"
                            ? seller?._id
                            : seller;

                    return (
                        sellerId ===
                        (user?.id ||
                            user?._id)
                    );
                });

            setAuctions(
                sellerAuctions
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
    }, [user]);

    const handleEnd = async (id) => {
        try {
            await endAuction(id);

            await loadAuctions();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to end auction."
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
                    <h1>My Auctions</h1>
                </div>

                <ErrorMessage message={error} />

                {auctions.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Auctions</h2>
                    </div>
                ) : (
                    <div className="orders-list">
                        {auctions.map((auction) => (
                            <div
                                className="order-card"
                                key={auction._id}
                            >
                                <h3>
                                    {auction.product
                                        ?.name ||
                                        "Product"}
                                </h3>

                                <p>
                                    Current Price: ₹
                                    {Number(
                                        auction.currentPrice
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </p>

                                <p>
                                    Status:{" "}
                                    {auction.status}
                                </p>

                                <p>
                                    Winner:{" "}
                                    {auction.winner
                                        ?.name ||
                                        "None"}
                                </p>

                                {auction.status !==
                                    "ended" && (
                                    <button
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
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default SellerAuctions;