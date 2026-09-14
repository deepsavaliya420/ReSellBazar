import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            setError("");

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
            setError("");

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

        return (
            sum +
            Number(product.price || 0) * quantity
        );
    }, 0);

    const totalItems = cart.reduce((sum, item) => {
        return sum + getQuantity(item);
    }, 0);

    if (loading) {
        return (
            <div className="cart-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="cart-page">

            <div className="cart-container">

                <div className="cart-header">
                    <div>
                        <span className="cart-label">
                            YOUR SHOPPING CART
                        </span>

                        <h1>My Cart</h1>

                        <p>
                            Review your selected products
                            before completing your purchase.
                        </p>
                    </div>

                    <div className="cart-count">
                        <span>🛒</span>
                        <strong>{totalItems}</strong>
                        <small>
                            {totalItems === 1
                                ? "Item"
                                : "Items"}
                        </small>
                    </div>
                </div>

                <ErrorMessage message={error} />

                {cart.length === 0 ? (
                    <div className="cart-empty">

                        <div className="cart-empty-icon">
                            🛒
                        </div>

                        <h2>Your Cart is Empty</h2>

                        <p>
                            Looks like you haven't added
                            anything to your cart yet.
                        </p>

                        <button
                            className="cart-shop-button"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Browse Products →
                        </button>

                    </div>
                ) : (
                    <div className="cart-content">

                        <div className="cart-products">

                            <div className="cart-products-header">
                                <div>
                                    <h2>
                                        Cart Items
                                    </h2>

                                    <span>
                                        {cart.length}{" "}
                                        {cart.length === 1
                                            ? "product"
                                            : "products"}
                                    </span>
                                </div>

                                <button
                                    className="cart-clear-button"
                                    onClick={handleClearCart}
                                    disabled={actionLoading}
                                >
                                    🗑 Clear Cart
                                </button>
                            </div>

                            <div className="cart-items">

                                {cart.map(
                                    (item, index) => {
                                        const product =
                                            getProduct(item);

                                        const quantity =
                                            getQuantity(item);

                                        const image =
                                            product.images &&
                                            product.images.length > 0
                                                ? product.images[0]
                                                : null;

                                        const price =
                                            Number(
                                                product.price || 0
                                            );

                                        const subtotal =
                                            price * quantity;

                                        return (
                                            <div
                                                className="cart-product"
                                                key={
                                                    item._id ||
                                                    product._id ||
                                                    index
                                                }
                                            >

                                                <div className="cart-product-image">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={
                                                                product.name
                                                            }
                                                        />
                                                    ) : (
                                                        <span>
                                                            📦
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="cart-product-info">

                                                    <span className="cart-product-tag">
                                                        PRODUCT
                                                    </span>

                                                    <h3>
                                                        {product.name}
                                                    </h3>

                                                    <p className="cart-product-price">
                                                        ₹
                                                        {price.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                    <div className="cart-product-meta">
                                                        <span>
                                                            Quantity
                                                        </span>

                                                        <div className="cart-quantity">
                                                            {quantity}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="cart-product-right">

                                                    <div className="cart-subtotal-label">
                                                        SUBTOTAL
                                                    </div>

                                                    <div className="cart-subtotal">
                                                        ₹
                                                        {subtotal.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </div>

                                                    <button
                                                        className="cart-remove-button"
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

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            <button
                                className="cart-continue-button"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                ← Continue Shopping
                            </button>

                        </div>

                        <aside className="cart-summary">

                            <div className="cart-summary-top">
                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h2>
                                    Cart Summary
                                </h2>
                            </div>

                            <div className="cart-summary-line">
                                <span>
                                    Products
                                </span>

                                <strong>
                                    {cart.length}
                                </strong>
                            </div>

                            <div className="cart-summary-line">
                                <span>
                                    Total Quantity
                                </span>

                                <strong>
                                    {totalItems}
                                </strong>
                            </div>

                            <div className="cart-summary-line">
                                <span>
                                    Delivery
                                </span>

                                <strong className="free">
                                    FREE
                                </strong>
                            </div>

                            <div className="cart-summary-divider" />

                            <div className="cart-total">
                                <div>
                                    <span>
                                        Total Amount
                                    </span>

                                    <small>
                                        Inclusive of all
                                        applicable charges
                                    </small>
                                </div>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <button
                                className="cart-checkout-button"
                                onClick={() =>
                                    navigate(
                                        "/buyer/checkout"
                                    )
                                }
                            >
                                Proceed to Checkout
                                <span>→</span>
                            </button>

                            <div className="cart-secure">
                                <span>🔒</span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <small>
                                        Your shopping experience
                                        is protected.
                                    </small>
                                </div>
                            </div>

                        </aside>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Cart;