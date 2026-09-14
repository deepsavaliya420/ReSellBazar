import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getAuctions } from "../../services/auctionApi";

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAuctions = async () => {
            try {
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

        loadAuctions();
    }, []);

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

            <main className="page-container">
                <div className="page-header">
                    <h1>Auctions</h1>
                    <p>Bid on products listed by sellers.</p>
                </div>

                <ErrorMessage message={error} />

                {auctions.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Auctions Available</h2>
                        <p>
                            There are no auctions available
                            right now.
                        </p>
                    </div>
                ) : (
                    <div className="auction-grid">
                        {auctions.map((auction) => (
                            <div
                                className="auction-card"
                                key={auction._id}
                            >
                                <div className="product-image">
                                    {auction.product?.images?.length ? (
                                        <img
                                            src={
                                                auction.product
                                                    .images[0]
                                            }
                                            alt={
                                                auction.product
                                                    .name
                                            }
                                        />
                                    ) : (
                                        <div>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <h2>
                                    {auction.product?.name ||
                                        "Product"}
                                </h2>

                                <p>
                                    Starting Price: ₹
                                    {auction.startingPrice}
                                </p>

                                <p>
                                    Current Price: ₹
                                    {auction.currentPrice}
                                </p>

                                <p>
                                    Status:{" "}
                                    {auction.status}
                                </p>

                                <Link
                                    to={`/auctions/${auction._id}`}
                                >
                                    View Auction
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
};

export default Auctions;