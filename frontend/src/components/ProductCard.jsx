import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../services/cartApi";
import { addToWishlist } from "../services/wishlistApi";

const ProductCard = ({ product }) => {
    const { user } = useAuth();

    const handleCart = async () => {
        if (!user) {
            alert("Please login first.");
            return;
        }

        try {
            await addToCart(product._id, 1);
            alert("Product added to cart.");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to add product to cart."
            );
        }
    };

    const handleWishlist = async () => {
        if (!user) {
            alert("Please login first.");
            return;
        }

        try {
            await addToWishlist(product._id);
            alert("Product added to wishlist.");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to add product to wishlist."
            );
        }
    };

    const image =
        product.images?.length > 0
            ? product.images[0]
            : null;

    const condition =
        product.condition || "Unknown";

    const quantity =
        product.quantity ?? 0;

    return (
        <div className="product-card">

            <div className="product-image-wrapper">
                {image ? (
                    <img
                        className="product-card-image"
                        src={image}
                        alt={product.name}
                        onError={(event) => {
                            event.currentTarget.style.display =
                                "none";

                            event.currentTarget.nextElementSibling.style.display =
                                "flex";
                        }}
                    />
                ) : null}

                <div
                    className="product-image-fallback"
                    style={{
                        display: image
                            ? "none"
                            : "flex"
                    }}
                >
                    <span>🛍️</span>
                    <p>No Image</p>
                </div>

                <span
                    className={`product-condition ${
                        condition.toLowerCase() === "new"
                            ? "condition-new"
                            : "condition-used"
                    }`}
                >
                    {condition}
                </span>
            </div>

            <div className="product-card-content">

                <h3 className="product-card-title">
                    {product.name}
                </h3>

                <p className="product-card-description">
                    {product.description ||
                        "Quality product available on ReSellBazar."}
                </p>

                <div className="product-card-price">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </div>

                <div className="product-card-meta">

                    <span>
                        {quantity > 0
                            ? `Stock: ${quantity}`
                            : "Out of Stock"}
                    </span>

                    <span
                        className={
                            quantity > 0
                                ? "stock-available"
                                : "stock-empty"
                        }
                    >
                        {quantity > 0
                            ? "Available"
                            : "Sold Out"}
                    </span>

                </div>

                <div className="product-card-actions">

                    <Link
                        to={`/products/${product._id}`}
                        className="btn btn-primary"
                    >
                        View Product
                    </Link>

                    {user?.role === "buyer" && (
                        <>
                            <button
                                className="btn btn-cart"
                                onClick={handleCart}
                                disabled={quantity <= 0}
                            >
                                🛒
                            </button>

                            <button
                                className="btn btn-wishlist"
                                onClick={handleWishlist}
                            >
                                ♡
                            </button>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default ProductCard;