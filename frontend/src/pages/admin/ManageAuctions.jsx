import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAuctions,
    endAuction
} from "../../services/auctionApi";


const statuses = [
    "active",
    "upcoming",
    "ended",
    "cancelled"
];


const ManageAuction = () => {

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("all");


    const loadAuctions = async (showLoader = true) => {

        try {

            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const data = await getAuctions();

            const auctionList =
                Array.isArray(data)
                    ? data
                    : data.auctions || [];

            setAuctions(
                Array.isArray(auctionList)
                    ? auctionList
                    : []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load auctions."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {
        loadAuctions();
    }, []);


    const handleRefresh = async () => {

        setMessage("");

        await loadAuctions(false);

    };


    const handleEndAuction = async (id) => {

        const confirmEnd =
            window.confirm(
                "Are you sure you want to end this auction?"
            );

        if (!confirmEnd) {
            return;
        }


        try {

            setError("");
            setMessage("");

            await endAuction(id);

            setMessage(
                "Auction ended successfully."
            );

            await loadAuctions(false);

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

        if (status === "upcoming") {
            return "status-upcoming";
        }

        if (status === "ended") {
            return "status-ended";
        }

        if (status === "cancelled") {
            return "status-cancelled";
        }

        return "status-other";

    };


    const getStatusLabel = (status) => {

        if (status === "active") {
            return "Active";
        }

        if (status === "upcoming") {
            return "Upcoming";
        }

        if (status === "ended") {
            return "Ended";
        }

        if (status === "cancelled") {
            return "Cancelled";
        }

        return "Unknown";

    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    const formatPrice = (price) => {

        return `₹${Number(
            price || 0
        ).toLocaleString("en-IN")}`;

    };


    const filteredAuctions =
        filter === "all"
            ? auctions
            : auctions.filter(
                (auction) =>
                    auction.status === filter
            );


    const activeCount =
        auctions.filter(
            (auction) =>
                auction.status === "active"
        ).length;


    const upcomingCount =
        auctions.filter(
            (auction) =>
                auction.status === "upcoming"
        ).length;


    const endedCount =
        auctions.filter(
            (auction) =>
                auction.status === "ended"
        ).length;


    const cancelledCount =
        auctions.filter(
            (auction) =>
                auction.status === "cancelled"
        ).length;


    if (loading) {

        return (
            <main className="page-container">
                <Loading />
            </main>
        );

    }


    return (

        <main className="page-container">

            <div className="page-header">

                <div>

                    <span className="dashboard-welcome-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        🔨 Manage Auctions
                    </h1>

                    <p>
                        Monitor seller auctions,
                        current bids, winners and
                        auction status.
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >

                    {refreshing
                        ? "Refreshing..."
                        : "↻ Refresh"}

                </button>

            </div>


            {error && (
                <ErrorMessage
                    message={error}
                />
            )}


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <h2>
                        🔨 Total Auctions
                    </h2>

                    <p>
                        {auctions.length}
                    </p>

                </div>


                <div className="dashboard-card">

                    <h2>
                        🟢 Active
                    </h2>

                    <p>
                        {activeCount}
                    </p>

                </div>


                <div className="dashboard-card">

                    <h2>
                        ⏳ Upcoming
                    </h2>

                    <p>
                        {upcomingCount}
                    </p>

                </div>


                <div className="dashboard-card">

                    <h2>
                        🏁 Ended
                    </h2>

                    <p>
                        {endedCount}
                    </p>

                </div>

            </div>


            <div
                className="page-header"
                style={{
                    marginTop: "30px"
                }}
            >

                <div>

                    <h2>
                        Auction Management
                    </h2>

                    <p>
                        Filter auctions by their
                        current status.
                    </p>

                </div>

            </div>


            <div
                className="table-actions"
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}
            >

                <button
                    type="button"
                    className={
                        filter === "all"
                            ? "btn btn-primary"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        setFilter("all")
                    }
                >
                    All ({auctions.length})
                </button>


                <button
                    type="button"
                    className={
                        filter === "active"
                            ? "btn btn-primary"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        setFilter("active")
                    }
                >
                    Active ({activeCount})
                </button>


                <button
                    type="button"
                    className={
                        filter === "upcoming"
                            ? "btn btn-primary"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        setFilter("upcoming")
                    }
                >
                    Upcoming ({upcomingCount})
                </button>


                <button
                    type="button"
                    className={
                        filter === "ended"
                            ? "btn btn-primary"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        setFilter("ended")
                    }
                >
                    Ended ({endedCount})
                </button>


                <button
                    type="button"
                    className={
                        filter === "cancelled"
                            ? "btn btn-primary"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        setFilter("cancelled")
                    }
                >
                    Cancelled ({cancelledCount})
                </button>

            </div>


            {filteredAuctions.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No Auctions Found
                    </h2>

                    <p>
                        There are currently no
                        auctions matching this
                        filter.
                    </p>

                </div>

            ) : (

                <div className="table-container">

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Seller
                                </th>

                                <th>
                                    Starting Price
                                </th>

                                <th>
                                    Current Price
                                </th>

                                <th>
                                    Start Time
                                </th>

                                <th>
                                    End Time
                                </th>

                                <th>
                                    Winner
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredAuctions.map(
                                (auction) => {

                                    const image =
                                        auction.product
                                            ?.images
                                            ?.length > 0
                                            ? auction
                                                .product
                                                .images[0]
                                            : null;


                                    return (

                                        <tr
                                            key={
                                                auction._id
                                            }
                                        >

                                            <td>

                                                <div className="table-product">

                                                    {image ? (

                                                        <img
                                                            src={image}
                                                            alt={
                                                                auction
                                                                    .product
                                                                    ?.name ||
                                                                "Product"
                                                            }
                                                            onError={(event) => {

                                                                event
                                                                    .currentTarget
                                                                    .style
                                                                    .display =
                                                                    "none";

                                                            }}
                                                        />

                                                    ) : (

                                                        <div
                                                            style={{
                                                                width: "55px",
                                                                height: "55px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                borderRadius: "10px",
                                                                background: "#eef2ff",
                                                                fontSize: "24px"
                                                            }}
                                                        >
                                                            📦
                                                        </div>

                                                    )}


                                                    <span>
                                                        {
                                                            auction
                                                                .product
                                                                ?.name ||
                                                            "Unknown Product"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    auction
                                                        .seller
                                                        ?.name ||
                                                    "Unknown Seller"
                                                }
                                            </td>


                                            <td>
                                                {formatPrice(
                                                    auction.startingPrice
                                                )}
                                            </td>


                                            <td>
                                                {formatPrice(
                                                    auction.currentPrice
                                                )}
                                            </td>


                                            <td>
                                                {formatDate(
                                                    auction.startTime
                                                )}
                                            </td>


                                            <td>
                                                {formatDate(
                                                    auction.endTime
                                                )}
                                            </td>


                                            <td>
                                                {
                                                    auction
                                                        .winner
                                                        ?.name ||
                                                    "No Winner"
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        auction.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        auction.status
                                                    )}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="table-actions">

                                                    <Link
                                                        to={`/buyer/auctions/${auction._id}`}
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

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </main>

    );

};


export default ManageAuction;