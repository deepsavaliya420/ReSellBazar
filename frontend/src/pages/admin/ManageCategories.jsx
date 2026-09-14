import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getCategories,
    createCategory,
    deleteCategory
} from "../../services/categoryApi";

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCategories();

            const list =
                data.categories ||
                data ||
                [];

            setCategories(
                Array.isArray(list) ? list : []
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

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setMessage("");

            await createCategory({
                name: name.trim(),
                description: description.trim()
            });

            setName("");
            setDescription("");

            setMessage(
                "Category created successfully."
            );

            await loadCategories();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create category."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteCategory(id);

            setCategories((current) =>
                current.filter(
                    (category) =>
                        category._id !== id
                )
            );

            setMessage(
                "Category deleted successfully."
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete category."
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
                    <h1>Manage Categories</h1>
                    <p>
                        Create and manage product categories.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="admin-section">
                    <h2>Add Category</h2>

                    <form onSubmit={handleSubmit}>
                        <label>
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter category name"
                            required
                        />

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Enter category description"
                            rows="4"
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating..."
                                : "Create Category"}
                        </button>
                    </form>
                </div>

                <div className="admin-section">
                    <h2>Existing Categories</h2>

                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <h3>
                                No Categories Found
                            </h3>

                            <p>
                                Create your first category
                                above.
                            </p>
                        </div>
                    ) : (
                        <div className="category-admin-list">
                            {categories.map(
                                (category) => (
                                    <div
                                        className="category-admin-card"
                                        key={
                                            category._id
                                        }
                                    >
                                        <div>
                                            <h3>
                                                {
                                                    category.name
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    category.description
                                                }
                                            </p>

                                            <small>
                                                Status:{" "}
                                                {
                                                    category.status
                                                }
                                            </small>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    category._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ManageCategories;