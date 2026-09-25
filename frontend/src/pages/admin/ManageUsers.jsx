import { useEffect, useState } from "react";

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

            setError("");

            const data = await getUsers();

            setUsers(
                Array.isArray(data)
                    ? data
                    : []
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


    const handleRole = async (
        id,
        role
    ) => {

        try {

            setError("");

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
            <div className="page-container">
                <Loading />
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <span className="dashboard-welcome-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Manage Users
                    </h1>

                    <p>
                        View users and manage their
                        marketplace roles.
                    </p>
                </div>

            </div>


            <ErrorMessage
                message={error}
            />


            <div className="orders-list">

                {users.length === 0 ? (

                    <div className="order-card">

                        <h3>
                            No users found
                        </h3>

                        <p>
                            There are currently no
                            registered users.
                        </p>

                    </div>

                ) : (

                    users.map((user) => (

                        <div
                            className="order-card"
                            key={user._id}
                        >

                            <div className="order-card-header">

                                <div>

                                    <h3>
                                        {user.name}
                                    </h3>

                                    <p>
                                        {user.email}
                                    </p>

                                </div>

                                <span
                                    className={
                                        user.status === "active"
                                            ? "status-badge status-delivered"
                                            : "status-badge status-cancelled"
                                    }
                                >
                                    {user.status}
                                </span>

                            </div>


                            <div className="order-info-grid">

                                <div>

                                    <strong>
                                        Mobile
                                    </strong>

                                    <p>
                                        {user.mobile}
                                    </p>

                                </div>


                                <div>

                                    <strong>
                                        Current Role
                                    </strong>

                                    <p>
                                        {user.role}
                                    </p>

                                </div>


                                <div>

                                    <strong>
                                        Change Role
                                    </strong>

                                    <select
                                        value={
                                            user.role
                                        }
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

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

};


export default ManageUsers;