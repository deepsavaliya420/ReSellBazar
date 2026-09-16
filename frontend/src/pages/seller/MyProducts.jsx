import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
            setLoading(true);
            setError("");

            const data = await getProducts();

            const list =
                data.products ||
                data ||
                [];

            const currentUserId =
                user?.id ||
                user?._id;

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
                        currentUserId
                    );
                });

            setProducts(
                Array.isArray(sellerProducts)
                    ? sellerProducts
                    : []
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
        if (user) {
            loadProducts();
        }
    }, [user]);

    const handleDelete = async (id) => {
        try {
            setError("");

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
            <div className="page-container">
                <Loading />
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        My Products
                    </h1>

                    <p>
                        Manage the products you have
                        listed on ReSellBazar.
                    </p>
                </div>

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

            <ErrorMessage
                message={error}
            />

            {products.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        You have not added any
                        products yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/seller/products/add"
                            )
                        }
                    >
                        Add Your First Product
                    </button>

                </div>

            ) : (

                <div className="products">

                    {products.map(
                        (product) => (

                            <div
                                className="product-card"
                                key={
                                    product._id
                                }
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

                                        <span>
                                            📦
                                        </span>

                                    )}

                                </div>

                                <div className="product-info">

                                    <h3>
                                        {
                                            product.name
                                        }
                                    </h3>

                                    <p>
                                        ₹
                                        {Number(
                                            product.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                    <p>
                                        Quantity:{" "}
                                        {
                                            product.quantity ??
                                            0
                                        }
                                    </p>

                                    <p>
                                        Condition:{" "}
                                        {
                                            product.condition ||
                                            "Unknown"
                                        }
                                    </p>

                                    <div>

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

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default MyProducts;