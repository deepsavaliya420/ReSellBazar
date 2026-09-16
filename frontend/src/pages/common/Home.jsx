import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getProducts } from "../../services/productApi";
import { getCategories } from "../../services/categoryApi";

import { useAuth } from "../../context/AuthContext";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    productsData,
                    categoriesData
                ] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);

                setProducts(
                    productsData.products ||
                    productsData ||
                    []
                );

                const categoryList =
                    categoriesData.categories ||
                    categoriesData ||
                    [];

                const mainCategories = [
                    "Electronics",
                    "Fashion",
                    "Home & Living",
                    "Beauty & Health",
                    "Sports & Fitness",
                    "Furniture"
                ];

                const filteredCategories =
                    Array.isArray(categoryList)
                        ? categoryList.filter(
                              (category) =>
                                  mainCategories.includes(
                                      category.name
                                  )
                          )
                        : [];

                setCategories(
                    filteredCategories
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load marketplace data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    const handleSellProduct = () => {
        if (!user) {
            navigate("/register", {
                state: {
                    from: {
                        pathname:
                            "/seller/products/add"
                    }
                }
            });

            return;
        }

        if (user.role === "seller") {
            navigate("/seller/products/add");
            return;
        }

        if (user.role === "buyer") {
            alert(
                "Your current account is a buyer account. Please contact an admin to change your account to seller."
            );
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-content">

                    <h1>
                        Buy. Sell. Auction.
                    </h1>

                    <p>
                        Your trusted marketplace for
                        new, used and auction products.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Shop Now
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={
                                handleSellProduct
                            }
                        >
                            Sell Your Product
                        </button>

                    </div>

                </div>
            </section>

            <section className="section">

                <div className="section-header">

                    <h2>
                        Browse Categories
                    </h2>

                    <Link to="/categories">
                        View All
                    </Link>

                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <div className="categories">

                        {categories.map(
                            (category) => (
                                <CategoryCard
                                    key={
                                        category._id ||
                                        category.name
                                    }
                                    category={
                                        category
                                    }
                                />
                            )
                        )}

                    </div>
                )}

            </section>

            <section className="section products-section">

                <div className="section-header">

                    <h2>
                        Featured Products
                    </h2>

                    <Link to="/products">
                        View All
                    </Link>

                </div>

                <ErrorMessage
                    message={error}
                />

                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <p>
                        No products available.
                    </p>
                ) : (
                    <div className="products">

                        {products
                            .slice(0, 8)
                            .map(
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

            </section>

            <section className="auction-section">

                <div>

                    <h2>
                        Discover Amazing Auctions
                    </h2>

                    <p>
                        Bid on unique products and get
                        the best deals.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                "/buyer/auctions"
                            )
                        }
                    >
                        Explore Auctions
                    </button>

                </div>

                <div className="auction-icon">
                    🔨
                </div>

            </section>
        </>
    );
};

export default Home;