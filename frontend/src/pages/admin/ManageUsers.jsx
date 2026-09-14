import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getUsers,
    updateUserRole
} from "../../services/adminApi";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {
        try {
            const data = await getUsers();

            setUsers(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRole = async (id, role) => {
        try {
            const data =
                await updateUserRole(
                    id,
                    role
                );

            const updated =
                data.user;

            setUsers((current) =>
                current.map((user) =>
                    user._id === id
                        ? updated
                        : user
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update role."
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
                    <h1>Manage Users</h1>
                </div>

                <ErrorMessage message={error} />

                <div className="orders-list">
                    {users.map((user) => (
                        <div
                            className="order-card"
                            key={user._id}
                        >
                            <h3>{user.name}</h3>

                            <p>
                                Email: {user.email}
                            </p>

                            <p>
                                Mobile: {user.mobile}
                            </p>

                            <p>
                                Status: {user.status}
                            </p>

                            <p>
                                Current Role:{" "}
                                <strong>
                                    {user.role}
                                </strong>
                            </p>

                            <select
                                value={user.role}
                                onChange={(e) =>
                                    handleRole(
                                        user._id,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="buyer">
                                    Buyer
                                </option>

                                <option value="seller">
                                    Seller
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ManageUsers;