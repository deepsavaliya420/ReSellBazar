import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAllTickets,
    updateTicket
} from "../../services/supportApi";

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTickets = async () => {
        try {
            const data =
                await getAllTickets();

            setTickets(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load support tickets."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleStatus = async (
        id,
        status
    ) => {
        try {
            await updateTicket(
                id,
                status
            );

            setTickets((current) =>
                current.map((ticket) =>
                    ticket._id === id
                        ? {
                              ...ticket,
                              status
                          }
                        : ticket
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update ticket."
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
                    <h1>Support Tickets</h1>
                </div>

                <ErrorMessage message={error} />

                <div className="orders-list">
                    {tickets.map((ticket) => (
                        <div
                            className="order-card"
                            key={ticket._id}
                        >
                            <h3>
                                {ticket.subject}
                            </h3>

                            <p>
                                User:{" "}
                                {ticket.user?.name}
                            </p>

                            <p>
                                Email:{" "}
                                {ticket.user?.email}
                            </p>

                            <p>
                                {ticket.message}
                            </p>

                            <p>
                                Status:{" "}
                                {ticket.status}
                            </p>

                            <button
                                onClick={() =>
                                    handleStatus(
                                        ticket._id,
                                        "in_progress"
                                    )
                                }
                            >
                                In Progress
                            </button>

                            <button
                                onClick={() =>
                                    handleStatus(
                                        ticket._id,
                                        "resolved"
                                    )
                                }
                            >
                                Resolve
                            </button>

                            <button
                                onClick={() =>
                                    handleStatus(
                                        ticket._id,
                                        "closed"
                                    )
                                }
                            >
                                Close
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SupportTickets;