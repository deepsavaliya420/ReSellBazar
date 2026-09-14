import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    ReSellBazar
                </Link>

                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/categories">
                        Categories
                    </Link>

                    {!user && (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                    {user?.role === "buyer" && (
                        <>
                            <Link to="/buyer">
                                Dashboard
                            </Link>

                            <Link to="/buyer/cart">
                                Cart
                            </Link>

                            <Link to="/buyer/wishlist">
                                Wishlist
                            </Link>

                            <Link to="/buyer/orders">
                                Orders
                            </Link>

                            <Link to="/buyer/auctions">
                                Auctions
                            </Link>

                            <Link to="/buyer/addresses">
                                Addresses
                            </Link>
                        </>
                    )}

                    {user?.role === "seller" && (
                        <Link to="/seller">
                            Seller Dashboard
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link to="/admin">
                            Admin Dashboard
                        </Link>
                    )}

                    {user && (
                        <div className="navbar-user">

                            <span className="navbar-user-name">
                                {user.name ||
                                    user.fullName ||
                                    user.email}
                            </span>

                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>
        </nav>
    );
};

export default Navbar;