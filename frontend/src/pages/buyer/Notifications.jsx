import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getNotifications,
    markNotificationAsRead
} from "../../services/notificationApi";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();

            setNotifications(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleRead = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications((current) =>
                current.map((item) =>
                    item._id === id
                        ? { ...item, read: true }
                        : item
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update notification."
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
                    <h1>Notifications</h1>
                    <p>Your latest account updates.</p>
                </div>

                <ErrorMessage message={error} />

                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Notifications</h2>
                    </div>
                ) : (
                    <div className="orders-list">
                        {notifications.map((item) => (
                            <div
                                className="order-card"
                                key={item._id}
                            >
                                <h3>{item.title}</h3>

                                <p>{item.message}</p>

                                <p>
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleString()}
                                </p>

                                {!item.read && (
                                    <button
                                        onClick={() =>
                                            handleRead(
                                                item._id
                                            )
                                        }
                                    >
                                        Mark as Read
                                    </button>
                                )}

                                {item.read && (
                                    <strong>
                                        Read
                                    </strong>
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

export default Notifications;