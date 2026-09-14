import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getMessages,
    sendMessage
} from "../../services/messageApi";

const Messages = () => {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadMessages = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = await getMessages(userId);

            setMessages(
                Array.isArray(data) ? data : []
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

    const handleSend = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await sendMessage(userId, message);

            setMessage("");

            const data = await getMessages(userId);

            setMessages(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to send message."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Messages</h1>
                    <p>Communicate with other users.</p>
                </div>

                <ErrorMessage message={error} />

                <form
                    className="form-card"
                    onSubmit={loadMessages}
                >
                    <input
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) =>
                            setUserId(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        {loading
                            ? "Loading..."
                            : "Open Conversation"}
                    </button>
                </form>

                {userId && (
                    <form
                        className="form-card"
                        onSubmit={handleSend}
                    >
                        <textarea
                            placeholder="Write a message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            required
                        />

                        <button type="submit">
                            Send Message
                        </button>
                    </form>
                )}

                <div className="orders-list">
                    {messages.map((item) => (
                        <div
                            className="order-card"
                            key={item._id}
                        >
                            <p>
                                <strong>
                                    {item.sender?.name ||
                                        "User"}
                                </strong>
                            </p>

                            <p>{item.message}</p>

                            <small>
                                {new Date(
                                    item.createdAt
                                ).toLocaleString()}
                            </small>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Messages;