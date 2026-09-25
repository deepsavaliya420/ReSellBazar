import { useEffect, useState } from "react";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAllTickets,
    getSupportTicketById,
    addTicketMessage,
    updateTicket
} from "../../services/supportApi";


const statuses = [
    "open",
    "in_progress",
    "resolved",
    "closed"
];


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


const SupportTickets = () => {

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [filter, setFilter] =
        useState("all");

    const [selectedTicket, setSelectedTicket] =
        useState(null);

    const [reply, setReply] =
        useState("");

    const [replyLoading, setReplyLoading] =
        useState(false);


    const loadTickets = async (
        showLoader = true
    ) => {

        try {

            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const data =
                await getAllTickets();

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
            setRefreshing(false);
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

            setError("");
            setMessage("");

            const data =
                await updateTicket(
                    id,
                    status
                );

            setTickets((current) =>
                current.map((ticket) =>
                    ticket._id === id
                        ? {
                              ...ticket,
                              status:
                                  data.ticket?.status ||
                                  status
                          }
                        : ticket
                )
            );

            if (
                selectedTicket &&
                selectedTicket._id === id
            ) {
                setSelectedTicket((current) => ({
                    ...current,
                    status:
                        data.ticket?.status ||
                        status
                }));
            }

            setMessage(
                "Support ticket updated successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update ticket."
            );
        }
    };


    const handleOpenTicket = async (
        id
    ) => {

        try {

            setError("");
            setMessage("");

            const ticket =
                await getSupportTicketById(
                    id
                );

            setSelectedTicket(ticket);

            setReply("");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load ticket conversation."
            );
        }
    };


    const handleCloseTicket = () => {
        setSelectedTicket(null);
        setReply("");
    };


    const handleReply = async () => {

        if (!reply.trim()) {
            return;
        }

        if (!selectedTicket) {
            return;
        }

        try {

            setReplyLoading(true);
            setError("");
            setMessage("");

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
                current.map((ticket) =>
                    ticket._id ===
                    updatedTicket._id
                        ? updatedTicket
                        : ticket
                )
            );

            setReply("");

            setMessage(
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


    const filteredTickets =
        filter === "all"
            ? tickets
            : tickets.filter(
                  (ticket) =>
                      ticket.status ===
                      filter
              );


    const openCount =
        tickets.filter(
            (ticket) =>
                ticket.status === "open"
        ).length;


    const progressCount =
        tickets.filter(
            (ticket) =>
                ticket.status ===
                "in_progress"
        ).length;


    const resolvedCount =
        tickets.filter(
            (ticket) =>
                ticket.status ===
                "resolved"
        ).length;


    const closedCount =
        tickets.filter(
            (ticket) =>
                ticket.status === "closed"
        ).length;


    if (loading) {
        return <Loading />;
    }


    return (
        <div className="page-container">

            <div className="page-header">

                <div>

                    <span className="orders-label">
                        CUSTOMER SUPPORT
                    </span>

                    <h1>
                        🎧 Support Tickets
                    </h1>

                    <p>
                        Manage customer questions,
                        complaints and support requests.
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        loadTickets(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "↻ Refresh"}
                </button>

            </div>


            <ErrorMessage
                message={error}
            />


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h2>
                        🎫 Total
                    </h2>

                    <p>
                        {tickets.length}
                    </p>
                </div>


                <div className="dashboard-card">
                    <h2>
                        🔴 Open
                    </h2>

                    <p>
                        {openCount}
                    </p>
                </div>


                <div className="dashboard-card">
                    <h2>
                        🔵 In Progress
                    </h2>

                    <p>
                        {progressCount}
                    </p>
                </div>


                <div className="dashboard-card">
                    <h2>
                        🟢 Resolved
                    </h2>

                    <p>
                        {resolvedCount}
                    </p>
                </div>


                <div className="dashboard-card">
                    <h2>
                        ⚫ Closed
                    </h2>

                    <p>
                        {closedCount}
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
                        Ticket Management
                    </h2>

                    <p>
                        Filter and manage customer
                        support requests.
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
                    All ({tickets.length})
                </button>


                {statuses.map(
                    (status) => {

                        const count =
                            tickets.filter(
                                (ticket) =>
                                    ticket.status ===
                                    status
                            ).length;

                        return (
                            <button
                                key={status}
                                type="button"
                                className={
                                    filter === status
                                        ? "btn btn-primary"
                                        : "btn btn-secondary"
                                }
                                onClick={() =>
                                    setFilter(
                                        status
                                    )
                                }
                            >
                                {formatStatus(
                                    status
                                )}{" "}
                                ({count})
                            </button>
                        );
                    }
                )}

            </div>


            {filteredTickets.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No Support Tickets
                    </h2>

                    <p>
                        There are no support tickets
                        matching this filter.
                    </p>

                </div>

            ) : (

                <div className="support-ticket-list">

                    {filteredTickets.map(
                        (ticket) => (

                            <div
                                className="support-ticket-card"
                                key={ticket._id}
                            >

                                <div className="support-ticket-header">

                                    <div>

                                        <span className="order-small-label">
                                            TICKET
                                        </span>

                                        <h3>
                                            #
                                            {ticket._id.slice(
                                                -8
                                            )}
                                        </h3>

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

                                </div>


                                <div className="support-ticket-subject">

                                    <span>
                                        SUBJECT
                                    </span>

                                    <h2>
                                        {ticket.subject}
                                    </h2>

                                </div>


                                <div className="support-ticket-user">

                                    <div className="support-user-icon">
                                        👤
                                    </div>

                                    <div>

                                        <strong>
                                            {ticket.user?.name ||
                                                "Unknown User"}
                                        </strong>

                                        <span>
                                            {ticket.user?.email ||
                                                "No email"}
                                        </span>

                                    </div>

                                </div>


                                <div className="support-ticket-message">

                                    <span>
                                        CUSTOMER MESSAGE
                                    </span>

                                    <p>
                                        {ticket.message}
                                    </p>

                                </div>


                                <div className="support-ticket-meta">

                                    <div>

                                        <span>
                                            Created
                                        </span>

                                        <strong>
                                            {formatDate(
                                                ticket.createdAt
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Last Updated
                                        </span>

                                        <strong>
                                            {formatDate(
                                                ticket.updatedAt
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                <div className="support-ticket-actions">

                                    <span>
                                        Update Status
                                    </span>


                                    <div>

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            disabled={
                                                ticket.status ===
                                                "open"
                                            }
                                            onClick={() =>
                                                handleStatus(
                                                    ticket._id,
                                                    "open"
                                                )
                                            }
                                        >
                                            Open
                                        </button>


                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            disabled={
                                                ticket.status ===
                                                "in_progress"
                                            }
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
                                            type="button"
                                            className="btn btn-secondary"
                                            disabled={
                                                ticket.status ===
                                                "resolved"
                                            }
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
                                            type="button"
                                            className="btn btn-secondary"
                                            disabled={
                                                ticket.status ===
                                                "closed"
                                            }
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

                                </div>


                                <div
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            handleOpenTicket(
                                                ticket._id
                                            )
                                        }
                                    >
                                        💬 Open Conversation
                                    </button>
                                </div>

                            </div>
                        )
                    )}

                </div>
            )}


            {selectedTicket && (
                <div
                    className="support-conversation-overlay"
                    onClick={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseTicket();
                        }

                    }}
                >

                    <div className="support-conversation-modal">

                        <div className="support-conversation-header">

                            <div>

                                <span>
                                    SUPPORT TICKET
                                </span>

                                <h2>
                                    {selectedTicket.subject}
                                </h2>

                                <p>
                                    {selectedTicket.user?.name ||
                                        "Unknown User"}
                                    {" • "}
                                    {selectedTicket.user?.email ||
                                        "No email"}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="support-close-button"
                                onClick={
                                    handleCloseTicket
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="support-conversation-status">

                            <span>
                                Status:
                            </span>

                            <strong
                                className={`support-status ${getStatusClass(
                                    selectedTicket.status
                                )}`}
                            >
                                {formatStatus(
                                    selectedTicket.status
                                )}
                            </strong>

                        </div>


                        <div className="support-conversation-body">

                            <div className="support-original-message">

                                <div className="support-message-header">

                                    <strong>
                                        {selectedTicket.user?.name ||
                                            "Customer"}
                                    </strong>

                                    <span>
                                        {formatDate(
                                            selectedTicket.createdAt
                                        )}
                                    </span>

                                </div>

                                <p>
                                    {selectedTicket.message}
                                </p>

                            </div>


                            {selectedTicket.messages?.map(
                                (item, index) => {

                                    const isAdmin =
                                        item.senderRole ===
                                        "admin";

                                    return (
                                        <div
                                            className={
                                                isAdmin
                                                    ? "support-chat-message support-chat-admin"
                                                    : "support-chat-message support-chat-user"
                                            }
                                            key={
                                                item._id ||
                                                index
                                            }
                                        >

                                            <div className="support-message-header">

                                                <strong>
                                                    {isAdmin
                                                        ? "Admin"
                                                        : item.sender?.name ||
                                                          selectedTicket
                                                              .user
                                                              ?.name ||
                                                          "Customer"}
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
                            )}

                        </div>


                        <div className="support-conversation-footer">

                            {selectedTicket.status ===
                            "closed" ? (

                                <div className="support-closed-message">
                                    🔒 This ticket is closed.
                                </div>

                            ) : (

                                <>

                                    <textarea
                                        value={reply}
                                        onChange={(event) =>
                                            setReply(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Write your reply..."
                                        rows={4}
                                    />

                                    <div className="support-reply-actions">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                handleStatus(
                                                    selectedTicket._id,
                                                    "resolved"
                                                )
                                            }
                                            disabled={
                                                selectedTicket.status ===
                                                "resolved"
                                            }
                                        >
                                            Mark Resolved
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary"
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
                                                : "Send Reply"}
                                        </button>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};


export default SupportTickets;