import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage the ReSellBazar
                        marketplace.
                    </p>
                </div>

            </div>


            <div className="dashboard-grid">

                <Link
                    className="dashboard-card"
                    to="/admin/users"
                >
                    <h2>
                        👥 Users
                    </h2>

                    <p>
                        Manage users and roles.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/products"
                >
                    <h2>
                        📦 Products
                    </h2>

                    <p>
                        Manage product approval.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/categories"
                >
                    <h2>
                        📂 Categories
                    </h2>

                    <p>
                        Manage marketplace categories.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/orders"
                >
                    <h2>
                        🚚 Orders & Delivery
                    </h2>

                    <p>
                        Manage customer orders,
                        delivery and tracking.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/auctions"
                >
                    <h2>
                        🔨 Auctions
                    </h2>

                    <p>
                        Manage seller auctions,
                        bids and winners.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/returns"
                >
                    <h2>
                        ↩️ Returns
                    </h2>

                    <p>
                        Manage customer return
                        requests.
                    </p>
                </Link>


                <Link
                    className="dashboard-card"
                    to="/admin/support"
                >
                    <h2>
                        🎧 Support
                    </h2>

                    <p>
                        Manage customer support
                        requests and tickets.
                    </p>
                </Link>

            </div>

        </div>
    );
};

export default AdminDashboard;