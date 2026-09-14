import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getProductById } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { addToWishlist } from "../../services/wishlistApi";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(id);
                setProduct(data.product || data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "buyer") {
            setMessage("Only buyers can add products to cart.");
            return;
        }

        try {
            setActionLoading(true);
            setMessage("");

            await addToCart(product._id, 1);

            setMessage("Product added to cart.");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add product to cart."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "buyer") {
            setMessage("Only buyers can use wishlist.");
            return;
        }

        try {
            setActionLoading(true);
            setMessage("");

            await addToWishlist(product._id);

            setMessage("Product added to wishlist.");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add product to wishlist."
            );
        } finally {
            setActionLoading(false);
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

    if (error || !product) {
        return (
            <>
                <Navbar />

                <div className="page-container">
                    <ErrorMessage
                        message={error || "Product not found."}
                    />

                    <button onClick={() => navigate("/products")}>
                        Back to Products
                    </button>
                </div>

                <Footer />
            </>
        );
    }

    const image =
        product.images && product.images.length > 0
            ? product.images[0]
            : null;

    const category =
        typeof product.category === "object"
            ? product.category?.name
            : product.category;

    const seller =
        typeof product.seller === "object"
            ? product.seller?.name
            : product.seller;

    return (
        <>
            <Navbar />

            <div className="page-container">
                <button
                    className="back-button"
                    onClick={() => navigate("/products")}
                >
                    ← Back to Products
                </button>

                <div className="product-details">
                    <div className="product-details-image">
                        {image ? (
                            <img src={image} alt={product.name} />
                        ) : (
                            <span>📦</span>
                        )}
                    </div>

                    <div className="product-details-info">
                        <span className="condition">
                            {product.condition}
                        </span>

                        <h1>{product.name}</h1>

                        <h2>
                            ₹
                            {Number(product.price).toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                        <p>
                            <strong>Category:</strong>{" "}
                            {category || "General"}
                        </p>

                        <p>
                            <strong>Quantity:</strong>{" "}
                            {product.quantity ?? 0}
                        </p>

                        <p>
                            <strong>Seller:</strong>{" "}
                            {seller || "Unknown"}
                        </p>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {message && (
                            <div className="error-message">
                                {message}
                            </div>
                        )}

                        <div className="product-actions">
                            <button
                                onClick={handleAddToCart}
                                disabled={
                                    actionLoading ||
                                    product.quantity <= 0
                                }
                            >
                                {actionLoading
                                    ? "Please wait..."
                                    : "Add to Cart"}
                            </button>

                            <button
                                onClick={handleAddToWishlist}
                                disabled={actionLoading}
                            >
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProductDetails;