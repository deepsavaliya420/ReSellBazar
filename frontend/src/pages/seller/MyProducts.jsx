import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getProducts,
    deleteProduct
} from "../../services/productApi";
import { useAuth } from "../../context/AuthContext";

const MyProducts = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        try {
            const data = await getProducts();

            const list =
                data.products ||
                data ||
                [];

            const sellerProducts =
                list.filter((product) => {
                    const seller =
                        product.seller;

                    const sellerId =
                        typeof seller === "object"
                            ? seller?._id
                            : seller;

                    return (
                        sellerId ===
                        (user?.id || user?._id)
                    );
                });

            setProducts(sellerProducts);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);

            setProducts((current) =>
                current.filter(
                    (product) =>
                        product._id !== id
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete product."
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
                    <h1>My Products</h1>

                    <button
                        onClick={() =>
                            navigate(
                                "/seller/products/add"
                            )
                        }
                    >
                        Add Product
                    </button>
                </div>

                <ErrorMessage message={error} />

                {products.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Approved Products</h2>

                        <p>
                            New products appear here after
                            approval.
                        </p>
                    </div>
                ) : (
                    <div className="products">
                        {products.map((product) => (
                            <div
                                className="product-card"
                                key={product._id}
                            >
                                <div className="product-image">
                                    {product.images?.[0] ? (
                                        <img
                                            src={
                                                product.images[0]
                                            }
                                            alt={
                                                product.name
                                            }
                                        />
                                    ) : (
                                        <span>📦</span>
                                    )}
                                </div>

                                <div className="product-info">
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
                                        {
                                            product.quantity
                                        }
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/seller/products/edit/${product._id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                product._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default MyProducts;