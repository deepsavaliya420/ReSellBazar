import { useEffect, useState } from "react";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import {
    getAllProducts,
    updateProductStatus
} from "../../services/adminApi";


const ManageProducts = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadProducts = async () => {

        try {

            setError("");

            const data = await getAllProducts();

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


    const handleStatus = async (
        id,
        status
    ) => {

        try {

            setError("");

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
            <div className="page-container">
                <Loading />
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <span className="dashboard-welcome-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Manage Products
                    </h1>

                    <p>
                        Review marketplace products
                        and manage their approval status.
                    </p>

                </div>

            </div>


            <ErrorMessage
                message={error}
            />


            <div className="products">

                {products.length === 0 ? (

                    <div className="order-card">

                        <h3>
                            No products found
                        </h3>

                        <p>
                            There are currently no
                            products to manage.
                        </p>

                    </div>

                ) : (

                    products.map((product) => (

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

                                    <span>
                                        📦
                                    </span>

                                )}

                            </div>


                            <div className="product-info">

                                <h3>
                                    {product.name}
                                </h3>


                                <p>
                                    <strong>
                                        Category:
                                    </strong>{" "}
                                    {product.category?.name ||
                                        "Unknown"}
                                </p>


                                <p>
                                    <strong>
                                        Seller:
                                    </strong>{" "}
                                    {product.seller?.name ||
                                        "Unknown"}
                                </p>


                                <p>
                                    <strong>
                                        Price:
                                    </strong>{" "}
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </p>


                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    <span
                                        className={`product-status product-status-${product.status}`}
                                    >
                                        {product.status}
                                    </span>
                                </p>


                                <div className="product-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatus(
                                                product._id,
                                                "approved"
                                            )
                                        }
                                        disabled={
                                            product.status ===
                                            "approved"
                                        }
                                    >
                                        ✓ Approve
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatus(
                                                product._id,
                                                "rejected"
                                            )
                                        }
                                        disabled={
                                            product.status ===
                                            "rejected"
                                        }
                                    >
                                        ✕ Reject
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

};


export default ManageProducts;