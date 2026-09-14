import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getProducts } from "../../services/productApi";

const Products = () => {
    const [searchParams] = useSearchParams();

    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getProducts();

                const productList =
                    data.products ||
                    data ||
                    [];

                setProducts(
                    Array.isArray(productList)
                        ? productList
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

        loadProducts();
    }, []);

    const filteredProducts =
        products.filter((product) => {
            const productName =
                product.name
                    ?.toLowerCase() || "";

            const description =
                product.description
                    ?.toLowerCase() || "";

            const productCategory =
                typeof product.category ===
                "object"
                    ? product.category?.name
                          ?.toLowerCase() || ""
                    : product.category
                          ?.toLowerCase() || "";

            const searchValue =
                search.toLowerCase();

            const categoryValue =
                category.toLowerCase();

            const matchesSearch =
                !searchValue ||
                productName.includes(
                    searchValue
                ) ||
                description.includes(
                    searchValue
                );

            const matchesCategory =
                !categoryValue ||
                productCategory ===
                    categoryValue;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        All Products
                    </h1>

                    {search && (
                        <p>
                            Search results for{" "}
                            <strong>
                                "{search}"
                            </strong>
                        </p>
                    )}

                    {category && (
                        <p>
                            Category:{" "}
                            <strong>
                                {category}
                            </strong>
                        </p>
                    )}
                </div>

            </div>

            <ErrorMessage
                message={error}
            />

            {loading ? (
                <Loading />
            ) : filteredProducts.length ===
              0 ? (

                <div className="empty-state">

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        There are currently
                        no products matching
                        your search.
                    </p>

                </div>

            ) : (

                <div className="products">

                    {filteredProducts.map(
                        (product) => (
                            <ProductCard
                                key={
                                    product._id
                                }
                                product={
                                    product
                                }
                            />
                        )
                    )}

                </div>
            )}

        </div>
    );
};

export default Products;