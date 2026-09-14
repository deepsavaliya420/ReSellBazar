import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getWishlist,
    removeFromWishlist
} from "../../services/wishlistApi";

const Wishlist = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getWishlist();

            setProducts(data.products || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load wishlist."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);

            setProducts((current) =>
                current.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to remove product."
            );
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

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>My Wishlist</h1>
                    <p>Products you saved for later.</p>
                </div>

                <ErrorMessage message={error} />

                {products.length === 0 ? (
                    <div className="empty-state">
                        <h2>Your Wishlist is Empty</h2>

                        <p>
                            Add products to your wishlist to see
                            them here.
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
                    <div className="products">
                        {products.map((product) => {
                            const image =
                                product.images &&
                                product.images.length > 0
                                    ? product.images[0]
                                    : null;

                            return (
                                <div
                                    className="product-card"
                                    key={product._id}
                                >
                                    <div
                                        className="product-image"
                                        onClick={() =>
                                            navigate(
                                                `/products/${product._id}`
                                            )
                                        }
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <span>📦</span>
                                        )}
                                    </div>

                                    <div className="product-info">
                                        <span className="condition">
                                            {product.condition}
                                        </span>

                                        <h3>{product.name}</h3>

                                        <strong>
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <div className="product-actions">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product._id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleRemove(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Wishlist;