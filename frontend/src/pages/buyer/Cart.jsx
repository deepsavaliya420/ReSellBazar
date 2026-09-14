import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getCart,
    removeFromCart,
    clearCart
} from "../../services/cartApi";

const Cart = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCart();

            const cartData =
                data.cart ||
                data.items ||
                data ||
                [];

            setCart(Array.isArray(cartData) ? cartData : []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load cart."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const getProduct = (item) => {
        return item.product || item;
    };

    const getQuantity = (item) => {
        return item.quantity || 1;
    };

    const handleRemove = async (item) => {
        const product = getProduct(item);

        try {
            setActionLoading(true);

            await removeFromCart(product._id);

            await loadCart();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to remove product."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearCart = async () => {
        try {
            setActionLoading(true);

            await clearCart();

            setCart([]);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to clear cart."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const total = cart.reduce((sum, item) => {
        const product = getProduct(item);
        const quantity = getQuantity(item);

        return sum + Number(product.price || 0) * quantity;
    }, 0);

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
                    <h1>My Cart</h1>
                    <p>
                        Review the products you want to purchase.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {cart.length === 0 ? (
                    <div className="empty-state">
                        <h2>Your Cart is Empty</h2>

                        <p>
                            You haven't added any products to your
                            cart yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-list">
                            {cart.map((item, index) => {
                                const product = getProduct(item);
                                const quantity =
                                    getQuantity(item);

                                const image =
                                    product.images &&
                                    product.images.length > 0
                                        ? product.images[0]
                                        : null;

                                const subtotal =
                                    Number(product.price || 0) *
                                    quantity;

                                return (
                                    <div
                                        className="cart-item"
                                        key={
                                            item._id ||
                                            product._id ||
                                            index
                                        }
                                    >
                                        <div className="cart-image">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={
                                                        product.name
                                                    }
                                                />
                                            ) : (
                                                <span>📦</span>
                                            )}
                                        </div>

                                        <div className="cart-info">
                                            <h3>
                                                {product.name}
                                            </h3>

                                            <p>
                                                ₹
                                                {Number(
                                                    product.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            <p>
                                                Quantity:{" "}
                                                {quantity}
                                            </p>

                                            <strong>
                                                Subtotal: ₹
                                                {subtotal.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemove(
                                                    item
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary">
                            <h2>Cart Summary</h2>

                            <p>
                                Items:{" "}
                                <strong>
                                    {cart.length}
                                </strong>
                            </p>

                            <h3>
                                Total: ₹
                                {total.toLocaleString("en-IN")}
                            </h3>

                            <div className="cart-actions">
                                <button
                                    onClick={handleClearCart}
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    Clear Cart
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/checkout"
                                        )
                                    }
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Cart;