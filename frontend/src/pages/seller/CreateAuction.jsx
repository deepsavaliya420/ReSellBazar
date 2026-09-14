import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ErrorMessage from "../../components/ErrorMessage";
import { getProducts } from "../../services/productApi";
import { createAuction } from "../../services/auctionApi";
import { useAuth } from "../../context/AuthContext";

const CreateAuction = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        product: "",
        startingPrice: "",
        startTime: "",
        endTime: ""
    });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();

                const list =
                    data.products ||
                    data ||
                    [];

                const sellerProducts =
                    list.filter((product) => {
                        const seller =
                            product.seller;

                        const sellerId =
                            typeof seller ===
                            "object"
                                ? seller?._id
                                : seller;

                        return (
                            sellerId ===
                            (user?.id ||
                                user?._id)
                        );
                    });

                setProducts(
                    sellerProducts
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );
            }
        };

        loadProducts();
    }, [user]);

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

            await createAuction({
                product: formData.product,
                startingPrice: Number(
                    formData.startingPrice
                ),
                startTime: formData.startTime,
                endTime: formData.endTime
            });

            navigate("/seller/auctions");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create auction."
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
                    <h1>Create Auction</h1>
                </div>

                <ErrorMessage message={error} />

                <form
                    className="form-card"
                    onSubmit={handleSubmit}
                >
                    <select
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Product
                        </option>

                        {products.map((product) => (
                            <option
                                key={product._id}
                                value={product._id}
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="startingPrice"
                        placeholder="Starting Price"
                        value={
                            formData.startingPrice
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Start Time
                    </label>

                    <input
                        type="datetime-local"
                        name="startTime"
                        value={
                            formData.startTime
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        End Time
                    </label>

                    <input
                        type="datetime-local"
                        name="endTime"
                        value={
                            formData.endTime
                        }
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Auction"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default CreateAuction;