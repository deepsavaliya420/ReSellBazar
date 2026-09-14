import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getProductById,
    updateProduct
} from "../../services/productApi";
import { getCategories } from "../../services/categoryApi";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        condition: "new",
        quantity: "",
        images: ""
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [productData, categoryData] =
                    await Promise.all([
                        getProductById(id),
                        getCategories()
                    ]);

                const product =
                    productData.product ||
                    productData;

                const category =
                    typeof product.category ===
                    "object"
                        ? product.category?._id
                        : product.category;

                setFormData({
                    name: product.name || "",
                    description:
                        product.description || "",
                    category: category || "",
                    price: product.price || "",
                    condition:
                        product.condition || "new",
                    quantity:
                        product.quantity || "",
                    images:
                        product.images?.join(", ") ||
                        ""
                });

                setCategories(
                    categoryData.categories ||
                    categoryData ||
                    []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await updateProduct(id, {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                images: formData.images
                    ? formData.images
                          .split(",")
                          .map((item) =>
                              item.trim()
                          )
                    : []
            });

            navigate("/seller/products");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
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
                    <h1>Edit Product</h1>
                </div>

                <ErrorMessage message={error} />

                <form
                    className="form-card"
                    onSubmit={handleSubmit}
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                    >
                        <option value="new">
                            New
                        </option>

                        <option value="used">
                            Used
                        </option>
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Updating..."
                            : "Update Product"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default EditProduct;