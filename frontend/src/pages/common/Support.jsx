import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
    createSupportTicket,
    getMySupportTickets,
    addTicketMessage
} from "../../services/supportApi";

import "../../styles/support.css";


const formatStatus = (status) => {

    if (!status) {
        return "Unknown";
    }

    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
};


const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
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


const getStatusClass = (status) => {

    if (status === "open") {
        return "support-status-open";
    }

    if (status === "in_progress") {
        return "support-status-progress";
    }

    if (status === "resolved") {
        return "support-status-resolved";
    }

    if (status === "closed") {
        return "support-status-closed";
    }

    return "";
};


const Support = () => {

    const { user } = useAuth();

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [creating, setCreating] =
        useState(false);

    const [replyLoading, setReplyLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [selectedTicket, setSelectedTicket] =
        useState(null);

    const [subject, setSubject] =
        useState("");

    const [ticketMessage, setTicketMessage] =
        useState("");

    const [reply, setReply] =
        useState("");


    const loadTickets = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMySupportTickets();

            const loadedTickets =
                Array.isArray(data)
                    ? data
                    : data.tickets || [];

            setTickets(loadedTickets);

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


    const handleCreateTicket = async (
        event
    ) => {

        event.preventDefault();

        if (
            !subject.trim() ||
            !ticketMessage.trim()
        ) {

            setError(
                "Subject and message are required."
            );

            return;
        }

        try {

            setCreating(true);
            setError("");
            setSuccess("");

            const data =
                await createSupportTicket({
                    subject:
                        subject.trim(),
                    message:
                        ticketMessage.trim()
                });

            const newTicket =
                data.ticket;

            setTickets((current) => [
                newTicket,
                ...current
            ]);

            setSubject("");
            setTicketMessage("");

            setSelectedTicket(
                newTicket
            );

            setSuccess(
                "Support ticket created successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create support ticket."
            );

        } finally {

            setCreating(false);
        }
    };


    const handleSelectTicket = (
        ticket
    ) => {

        setSelectedTicket(ticket);

        setReply("");

        setError("");

        setSuccess("");
    };


    const handleReply = async () => {

        if (!selectedTicket) {
            return;
        }

        if (!reply.trim()) {
            return;
        }

        try {

            setReplyLoading(true);
            setError("");
            setSuccess("");

            const data =
                await addTicketMessage(
                    selectedTicket._id,
                    reply.trim()
                );

            const updatedTicket =
                data.ticket;

            setSelectedTicket(
                updatedTicket
            );

            setTickets((current) =>
                current.map(
                    (ticket) =>
                        ticket._id ===
                        updatedTicket._id
                            ? updatedTicket
                            : ticket
                )
            );

            setReply("");

            setSuccess(
                "Reply sent successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to send reply."
            );

        } finally {

            setReplyLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="support-page">

                <div className="support-loading">

                    <div className="support-loading-icon">
                        🎧
                    </div>

                    <h2>
                        Loading Support
                    </h2>

                    <p>
                        Please wait while we load your
                        support tickets.
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="support-page">

            <div className="support-container">


                {/* HEADER */}

                <div className="support-header">

                    <div>

                        <span className="support-eyebrow">
                            CUSTOMER SUPPORT
                        </span>

                        <h1>
                            🎧 Customer Support
                        </h1>

                        <p>
                            Need help? Create a support
                            ticket and communicate directly
                            with our support team.
                        </p>

                    </div>

                    <div className="support-header-icon">
                        🎧
                    </div>

                </div>


                {/* ALERTS */}

                {error && (

                    <div className="support-alert support-alert-error">

                        <span>
                            ⚠️
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {success && (

                    <div className="support-alert support-alert-success">

                        <span>
                            ✅
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* USER INFO */}

                <div className="support-user-bar">

                    <div className="support-user-avatar">

                        {(
                            user?.name ||
                            user?.fullName ||
                            user?.email ||
                            "U"
                        )
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div>

                        <span>
                            Logged in as
                        </span>

                        <strong>
                            {user?.name ||
                                user?.fullName ||
                                user?.email ||
                                "User"}
                        </strong>

                    </div>

                </div>


                {/* MAIN GRID */}

                <div className="support-main-grid">


                    {/* CREATE TICKET */}

                    <div className="support-card support-create-card">

                        <div className="support-card-header">

                            <div>

                                <span>
                                    NEED HELP?
                                </span>

                                <h2>
                                    Create Support Ticket
                                </h2>

                            </div>

                            <div className="support-card-icon">
                                📝
                            </div>

                        </div>


                        <form
                            className="support-form"
                            onSubmit={
                                handleCreateTicket
                            }
                        >

                            <div className="support-form-group">

                                <label>
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(event) =>
                                        setSubject(
                                            event.target.value
                                        )
                                    }
                                    placeholder="What do you need help with?"
                                    required
                                />

                            </div>


                            <div className="support-form-group">

                                <label>
                                    Message
                                </label>

                                <textarea
                                    value={ticketMessage}
                                    onChange={(event) =>
                                        setTicketMessage(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe your problem in detail..."
                                    rows={7}
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="support-primary-button"
                                disabled={creating}
                            >

                                <span>
                                    {creating
                                        ? "Creating..."
                                        : "Create Ticket"}
                                </span>

                                {!creating && (
                                    <span>
                                        →
                                    </span>
                                )}

                            </button>

                        </form>

                    </div>


                    {/* TICKET LIST */}

                    <div className="support-card support-tickets-card">

                        <div className="support-card-header">

                            <div>

                                <span>
                                    YOUR REQUESTS
                                </span>

                                <h2>
                                    My Support Tickets
                                </h2>

                            </div>

                            <div className="support-ticket-count">
                                {tickets.length}
                            </div>

                        </div>


                        {tickets.length === 0 ? (

                            <div className="support-empty">

                                <div className="support-empty-icon">
                                    🎫
                                </div>

                                <h3>
                                    No support tickets
                                </h3>

                                <p>
                                    You haven't created any
                                    support requests yet.
                                </p>

                            </div>

                        ) : (

                            <div className="support-ticket-list">

                                {tickets.map(
                                    (ticket) => (

                                        <button
                                            type="button"
                                            key={
                                                ticket._id
                                            }
                                            className={
                                                selectedTicket?._id ===
                                                ticket._id
                                                    ? "support-ticket-item active"
                                                    : "support-ticket-item"
                                            }
                                            onClick={() =>
                                                handleSelectTicket(
                                                    ticket
                                                )
                                            }
                                        >

                                            <div className="support-ticket-item-main">

                                                <strong>
                                                    {ticket.subject}
                                                </strong>

                                                <span>
                                                    Updated{" "}
                                                    {formatDate(
                                                        ticket.updatedAt
                                                    )}
                                                </span>

                                            </div>


                                            <span
                                                className={`support-status ${getStatusClass(
                                                    ticket.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    ticket.status
                                                )}
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* CONVERSATION */}

                {selectedTicket && (

                    <div className="support-card support-conversation-card">

                        <div className="support-conversation-header">

                            <div>

                                <span>
                                    SUPPORT CONVERSATION
                                </span>

                                <h2>
                                    {selectedTicket.subject}
                                </h2>

                                <p>
                                    Created{" "}
                                    {formatDate(
                                        selectedTicket.createdAt
                                    )}
                                </p>

                            </div>


                            <span
                                className={`support-status ${getStatusClass(
                                    selectedTicket.status
                                )}`}
                            >
                                {formatStatus(
                                    selectedTicket.status
                                )}
                            </span>

                        </div>


                        <div className="support-chat">

                            {selectedTicket.messages?.length > 0 ? (

                                selectedTicket.messages.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const isAdmin =
                                            item.senderRole ===
                                            "admin";

                                        return (
                                            <div
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                                className={
                                                    isAdmin
                                                        ? "support-chat-message support-chat-admin"
                                                        : "support-chat-message support-chat-user"
                                                }
                                            >

                                                <div className="support-chat-message-header">

                                                    <strong>
                                                        {isAdmin
                                                            ? "Admin"
                                                            : "You"}
                                                    </strong>

                                                    <span>
                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                                <p>
                                                    {
                                                        item.message
                                                    }
                                                </p>

                                            </div>
                                        );
                                    }
                                )

                            ) : (

                                <div className="support-chat-message support-chat-user">

                                    <div className="support-chat-message-header">

                                        <strong>
                                            You
                                        </strong>

                                        <span>
                                            {formatDate(
                                                selectedTicket.createdAt
                                            )}
                                        </span>

                                    </div>

                                    <p>
                                        {
                                            selectedTicket.message
                                        }
                                    </p>

                                </div>

                            )}

                        </div>


                        {selectedTicket.status ===
                        "closed" ? (

                            <div className="support-closed">

                                <span>
                                    🔒
                                </span>

                                <div>

                                    <strong>
                                        Ticket Closed
                                    </strong>

                                    <p>
                                        This support ticket is
                                        closed and cannot receive
                                        new replies.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="support-reply-area">

                                <textarea
                                    value={reply}
                                    onChange={(event) =>
                                        setReply(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Write your reply to the support team..."
                                    rows={4}
                                />

                                <div className="support-reply-footer">

                                    <span>
                                        Our support team will
                                        see your message.
                                    </span>

                                    <button
                                        type="button"
                                        className="support-primary-button"
                                        onClick={
                                            handleReply
                                        }
                                        disabled={
                                            replyLoading ||
                                            !reply.trim()
                                        }
                                    >
                                        {replyLoading
                                            ? "Sending..."
                                            : "Send Reply →"}
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
};


export default Support;