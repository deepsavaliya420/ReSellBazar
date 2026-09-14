import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    createSupportTicket,
    getMySupportTickets
} from "../../services/supportApi";

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        subject: "",
        message: ""
    });

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMySupportTickets();

            setTickets(
                Array.isArray(data)
                    ? data
                    : data.tickets || []
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            setMessage("");

            await createSupportTicket(formData);

            setFormData({
                subject: "",
                message: ""
            });

            setMessage(
                "Support ticket created successfully."
            );

            await loadTickets();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create support ticket."
            );
        } finally {
            setSubmitting(false);
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
                    <h1>Customer Support</h1>
                    <p>
                        Create a support ticket and track your
                        requests.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="support-section">
                    <h2>Create Support Ticket</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Subject</label>

                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter your issue"
                            required
                        />

                        <label>Message</label>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Describe your issue"
                            rows="6"
                            required
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Create Ticket"}
                        </button>
                    </form>
                </div>

                <div className="support-section">
                    <h2>My Support Tickets</h2>

                    {tickets.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Support Tickets</h3>
                            <p>
                                You have not created any support
                                tickets yet.
                            </p>
                        </div>
                    ) : (
                        <div className="support-list">
                            {tickets.map((ticket) => (
                                <div
                                    className="support-card"
                                    key={ticket._id}
                                >
                                    <h3>
                                        {ticket.subject}
                                    </h3>

                                    <p>
                                        {ticket.message}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        <strong>
                                            {ticket.status ||
                                                "open"}
                                        </strong>
                                    </p>

                                    {ticket.createdAt && (
                                        <p>
                                            Created:{" "}
                                            {new Date(
                                                ticket.createdAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Support;