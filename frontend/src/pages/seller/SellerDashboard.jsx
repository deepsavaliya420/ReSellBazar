import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SellerDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>
                    Seller Dashboard
                </h1>

                <p>
                    Welcome, {user?.name}. Manage your
                    marketplace activity.
                </p>
            </div>

            <div className="dashboard-grid">

                <Link
                    className="dashboard-card"
                    to="/seller/products"
                >
                    <h2>📦 My Products</h2>

                    <p>
                        Manage your products.
                    </p>
                </Link>

                <Link
                    className="dashboard-card"
                    to="/seller/products/add"
                >
                    <h2>➕ Add Product</h2>

                    <p>
                        List a new product.
                    </p>
                </Link>

                <Link
                    className="dashboard-card"
                    to="/seller/auctions"
                >
                    <h2>🔨 Auctions</h2>

                    <p>
                        Manage your auctions.
                    </p>
                </Link>

                <Link
                    className="dashboard-card"
                    to="/seller/auctions/add"
                >
                    <h2>⚡ Create Auction</h2>

                    <p>
                        Put a product up for auction.
                    </p>
                </Link>

                <Link
                    className="dashboard-card"
                    to="/seller/orders"
                >
                    <h2>📦 Orders</h2>

                    <p>
                        Manage customer orders.
                    </p>
                </Link>

            </div>

        </div>
    );
};

export default SellerDashboard;