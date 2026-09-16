import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorMessage from "../../components/ErrorMessage";

import {
    createProduct
} from "../../services/productApi";

import {
    getCategories
} from "../../services/categoryApi";

const AddProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] =
        useState([]);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            description: "",
            category: "",
            price: "",
            condition: "new",
            quantity: "",
            images: ""
        });

    useEffect(() => {
        const loadCategories =
            async () => {
                try {
                    const data =
                        await getCategories();

                    const list =
                        data.categories ||
                        data ||
                        [];

                    setCategories(
                        Array.isArray(list)
                            ? list
                            : []
                    );

                } catch (error) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Failed to load categories."
                    );
                }
            };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError(
                "Product name is required."
            );
            return;
        }

        if (!formData.description.trim()) {
            setError(
                "Product description is required."
            );
            return;
        }

        if (!formData.category) {
            setError(
                "Please select a category."
            );
            return;
        }

        if (
            !formData.price ||
            Number(formData.price) <= 0
        ) {
            setError(
                "Price must be greater than ₹0."
            );
            return;
        }

        if (
            !formData.quantity ||
            Number(formData.quantity) <= 0
        ) {
            setError(
                "Quantity must be greater than 0."
            );
            return;
        }

        try {
            setLoading(true);

            await createProduct({
                name: formData.name.trim(),

                description:
                    formData.description.trim(),

                category:
                    formData.category,

                price:
                    Number(formData.price),

                condition:
                    formData.condition,

                quantity:
                    Number(formData.quantity),

                images: formData.images
                    ? formData.images
                          .split(",")
                          .map(
                              (item) =>
                                  item.trim()
                          )
                          .filter(
                              (item) =>
                                  item
                                      .length > 0
                          )
                    : []
            });

            navigate(
                "/seller/products"
            );

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
        <div className="page-container">

            <div className="page-header">

                <h1>
                    Add Product
                </h1>

                <p>
                    Add your product to
                    ReSellBazar marketplace.
                </p>

            </div>

            <ErrorMessage
                message={error}
            />

            <form
                className="form-card"
                onSubmit={handleSubmit}
            >

                <label>
                    Product Name
                </label>

                <input
                    name="name"
                    placeholder="Enter product name"
                    value={
                        formData.name
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <label>
                    Description
                </label>

                <textarea
                    name="description"
                    placeholder="Enter product description"
                    value={
                        formData.description
                    }
                    onChange={
                        handleChange
                    }
                    rows="5"
                    required
                />

                <label>
                    Category
                </label>

                <select
                    name="category"
                    value={
                        formData.category
                    }
                    onChange={
                        handleChange
                    }
                    required
                >

                    <option value="">
                        Select Category
                    </option>

                    {categories.map(
                        (category) => (
                            <option
                                key={
                                    category._id
                                }
                                value={
                                    category._id
                                }
                            >
                                {
                                    category.name
                                }
                            </option>
                        )
                    )}

                </select>

                <label>
                    Price
                </label>

                <input
                    type="number"
                    name="price"
                    min="1"
                    placeholder="Enter price"
                    value={
                        formData.price
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <label>
                    Condition
                </label>

                <select
                    name="condition"
                    value={
                        formData.condition
                    }
                    onChange={
                        handleChange
                    }
                >

                    <option value="new">
                        New
                    </option>

                    <option value="used">
                        Used
                    </option>

                </select>

                <label>
                    Quantity
                </label>

                <input
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="Enter quantity"
                    value={
                        formData.quantity
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <label>
                    Product Photo
                </label>

                <input
                    name="images"
                    placeholder="Paste image URL(s), separated by comma"
                    value={
                        formData.images
                    }
                    onChange={
                        handleChange
                    }
                />

                <p>
                    You can paste one or more
                    image URLs separated by commas.
                </p>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Product..."
                        : "Create Product"}
                </button>

            </form>

        </div>
    );
};

export default AddProduct;