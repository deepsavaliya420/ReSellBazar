import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import CategoryCard from "../../components/CategoryCard";

import { getCategories } from "../../services/categoryApi";

const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCategories();

                const categoryList =
                    data.categories || data || [];

                setCategories(
                    Array.isArray(categoryList)
                        ? categoryList
                        : []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load categories."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

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
                    <h1>Categories</h1>

                    <p>
                        Browse products by category.
                    </p>
                </div>
            </div>

            {error && (
                <ErrorMessage message={error} />
            )}

            {categories.length === 0 ? (
                <div className="empty-state">

                    <h2>No Categories Found</h2>

                    <p>
                        There are currently no active
                        categories.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Browse All Products
                    </button>

                </div>
            ) : (
                <div className="categories">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Categories;