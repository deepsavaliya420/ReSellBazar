import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getProducts
} from "../../services/productApi";
import {
    updateProductStatus
} from "../../services/adminApi";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        try {
            const data = await getProducts();

            setProducts(
                data.products ||
                data ||
                []
            );
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

    const handleStatus = async (id, status) => {
        try {
            const data =
                await updateProductStatus(
                    id,
                    status
                );

            setProducts((current) =>
                current.map((product) =>
                    product._id === id
                        ? data.product
                        : product
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update product."
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
                    <h1>Manage Products</h1>
                </div>

                <ErrorMessage message={error} />

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
                                    Seller:{" "}
                                    {product.seller
                                        ?.name ||
                                        "Unknown"}
                                </p>

                                <p>
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </p>

                                <p>
                                    Status:{" "}
                                    {product.status}
                                </p>

                                <button
                                    onClick={() =>
                                        handleStatus(
                                            product._id,
                                            "approved"
                                        )
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        handleStatus(
                                            product._id,
                                            "rejected"
                                        )
                                    }
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ManageProducts;