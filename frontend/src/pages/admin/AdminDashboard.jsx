import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>
                        Manage the ReSellBazar marketplace.
                    </p>
                </div>

                <div className="dashboard-grid">
                    <Link
                        className="dashboard-card"
                        to="/admin/users"
                    >
                        <h2>👥 Users</h2>
                        <p>Manage users and roles.</p>
                    </Link>

                    <Link
                        className="dashboard-card"
                        to="/admin/products"
                    >
                        <h2>📦 Products</h2>
                        <p>Manage product approval.</p>
                    </Link>

                    <Link
                        className="dashboard-card"
                        to="/admin/categories"
                    >
                        <h2>📂 Categories</h2>
                        <p>Manage categories.</p>
                    </Link>

                    <Link
                        className="dashboard-card"
                        to="/admin/orders"
                    >
                        <h2>🧾 Orders</h2>
                        <p>Manage all orders.</p>
                    </Link>

                    <Link
                        className="dashboard-card"
                        to="/admin/returns"
                    >
                        <h2>↩️ Returns</h2>
                        <p>Manage return requests.</p>
                    </Link>

                    <Link
                        className="dashboard-card"
                        to="/admin/support"
                    >
                        <h2>🎧 Support</h2>
                        <p>Manage support tickets.</p>
                    </Link>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default AdminDashboard;