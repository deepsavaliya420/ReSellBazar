import { useEffect, useState } from "react";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getMessages
} from "../../services/messageApi";

import { useAuth } from "../../context/AuthContext";

const SellerMessages = () => {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMessages(user._id);

            setMessages(
                Array.isArray(data)
                    ? data
                    : data.messages || []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load messages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            loadMessages();
        }
    }, [user?._id]);

    if (loading) {
        return (
            <div className="page-container">
                <Loading />
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Messages</h1>

                    <p>
                        View messages from buyers.
                    </p>
                </div>
            </div>

            {error && (
                <ErrorMessage message={error} />
            )}

            {messages.length === 0 ? (
                <div className="empty-state">
                    <h2>No Messages</h2>

                    <p>
                        You don't have any messages yet.
                    </p>
                </div>
            ) : (
                <div className="messages-list">

                    {messages.map((message) => (
                        <div
                            className="message-card"
                            key={message._id}
                        >
                            <div className="message-header">

                                <div>
                                    <h3>
                                        {message.sender?.name ||
                                            "Unknown User"}
                                    </h3>

                                    <p>
                                        {message.sender?.email ||
                                            ""}
                                    </p>
                                </div>

                                <span>
                                    {message.createdAt
                                        ? new Date(
                                              message.createdAt
                                          ).toLocaleString()
                                        : ""}
                                </span>

                            </div>

                            <div className="message-body">
                                <p>
                                    {message.message}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default SellerMessages;