import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ErrorMessage from "../../components/ErrorMessage";
import {
    createProduct
} from "../../services/productApi";
import {
    getCategories
} from "../../services/categoryApi";

const AddProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        const loadCategories = async () => {
            try {
                const data = await getCategories();

                setCategories(
                    data.categories || data || []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load categories."
                );
            }
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await createProduct({
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                images: formData.images
                    ? formData.images
                          .split(",")
                          .map((item) => item.trim())
                    : []
            });

            navigate("/seller/products");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Add Product</h1>
                </div>

                <ErrorMessage message={error} />

                <form
                    className="form-card"
                    onSubmit={handleSubmit}
                >
                    <input
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
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
                        placeholder="Price"
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
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="images"
                        placeholder="Image URLs separated by comma"
                        value={formData.images}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Product"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default AddProduct;