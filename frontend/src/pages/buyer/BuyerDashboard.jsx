import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BuyerDashboard = () => {
    const { user } = useAuth();

    const dashboardCards = [
        {
            icon: "🛍️",
            title: "Products",
            description: "Browse all available products and discover great deals.",
            link: "/products",
            className: "dashboard-card-products"
        },
        {
            icon: "🛒",
            title: "Cart",
            description: "View and manage products you have added to your cart.",
            link: "/buyer/cart",
            className: "dashboard-card-cart"
        },
        {
            icon: "❤️",
            title: "Wishlist",
            description: "View your saved products and keep your favorites.",
            link: "/buyer/wishlist",
            className: "dashboard-card-wishlist"
        },
        {
            icon: "📦",
            title: "Orders",
            description: "Track your purchases and check your order status.",
            link: "/buyer/orders",
            className: "dashboard-card-orders"
        },
        {
            icon: "📂",
            title: "Categories",
            description: "Explore products by different categories.",
            link: "/categories",
            className: "dashboard-card-categories"
        },
        {
            icon: "💳",
            title: "Checkout",
            description: "Complete your purchase and place your order.",
            link: "/buyer/checkout",
            className: "dashboard-card-checkout"
        }
    ];

    return (
        <div className="buyer-dashboard">

            <div className="buyer-dashboard-header">
                <div>
                    <span className="dashboard-welcome-label">
                        BUYER DASHBOARD
                    </span>

                    <h1>
                        Welcome,{" "}
                        <span>
                            {user?.name ||
                                user?.fullName ||
                                "Buyer"}
                        </span>
                    </h1>

                    <p>
                        Manage your shopping activity,
                        discover products and track your
                        purchases from one place.
                    </p>
                </div>

                <div className="dashboard-profile-icon">
                    {(
                        user?.name ||
                        user?.fullName ||
                        "B"
                    )
                        .charAt(0)
                        .toUpperCase()}
                </div>
            </div>

            <div className="dashboard-quick-title">
                <div>
                    <h2>Quick Access</h2>
                    <p>
                        Everything you need, right at your
                        fingertips.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className={`dashboard-card ${card.className}`}
                    >
                        <div className="dashboard-card-top">
                            <div className="dashboard-card-icon">
                                {card.icon}
                            </div>

                            <span className="dashboard-card-arrow">
                                →
                            </span>
                        </div>

                        <div className="dashboard-card-content">
                            <h2>{card.title}</h2>

                            <p>
                                {card.description}
                            </p>
                        </div>

                        <span className="dashboard-card-link">
                            Explore
                        </span>
                    </Link>
                ))}
            </div>

            <div className="buyer-dashboard-banner">
                <div>
                    <span>RESELLBAZAR</span>

                    <h2>
                        Find it. Buy it. Enjoy it.
                    </h2>

                    <p>
                        Discover amazing products and
                        unbeatable deals.
                    </p>

                    <Link
                        to="/products"
                        className="dashboard-shop-button"
                    >
                        Start Shopping →
                    </Link>
                </div>

                <div className="dashboard-banner-icon">
                    🛒
                </div>
            </div>

        </div>
    );
};

export default BuyerDashboard;