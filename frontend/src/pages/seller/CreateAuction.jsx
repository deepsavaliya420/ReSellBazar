import { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import ErrorMessage from "../../components/ErrorMessage";

import {
    getProducts
} from "../../services/productApi";

import {
    createAuction
} from "../../services/auctionApi";

import { useAuth } from "../../context/AuthContext";

import "../../styles/auction.css";

const CreateAuction = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [products, setProducts] = useState([]);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [productsLoading, setProductsLoading] =
        useState(true);

    const [formData, setFormData] = useState({
        product: "",
        startingPrice: "",
        startTime: "",
        endTime: ""
    });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setProductsLoading(true);
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
                    sellerProducts
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );
            } finally {
                setProductsLoading(false);
            }
        };

        if (user) {
            loadProducts();
        }
    }, [user]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const startingPrice =
            Number(
                formData.startingPrice
            );

        if (
            !formData.product ||
            !formData.startingPrice ||
            !formData.startTime ||
            !formData.endTime
        ) {
            setError(
                "Please fill all fields."
            );
            return;
        }

        if (startingPrice <= 0) {
            setError(
                "Starting price must be greater than ₹0."
            );
            return;
        }

        const start =
            new Date(
                formData.startTime
            );

        const end =
            new Date(
                formData.endTime
            );

        const now = new Date();

        if (start <= now) {
            setError(
                "Start time must be in the future."
            );
            return;
        }

        if (end <= start) {
            setError(
                "End time must be after start time."
            );
            return;
        }

        try {
            setLoading(true);

            await createAuction({
                product:
                    formData.product,

                startingPrice,

                startTime:
                    formData.startTime,

                endTime:
                    formData.endTime
            });

            navigate(
                "/seller/auctions"
            );
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
        <main className="auction-page">

            <section className="create-auction-page">

                <Link
                    to="/seller/auctions"
                    className="auction-back-link"
                >
                    ← Back to My Auctions
                </Link>

                <div className="create-auction-header">

                    <span className="auction-hero-badge">
                        🔨 SELLER AUCTION
                    </span>

                    <h1>
                        Create New Auction
                    </h1>

                    <p>
                        Select your product,
                        set your starting price,
                        and choose when the
                        auction will run.
                    </p>

                </div>

                <ErrorMessage
                    message={error}
                />

                <form
                    className="create-auction-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auction-form-section">

                        <h2>
                            1. Select Product
                        </h2>

                        <p>
                            Choose one of your
                            products to auction.
                        </p>

                        {productsLoading ? (

                            <div className="form-loading">
                                Loading your products...
                            </div>

                        ) : products.length === 0 ? (

                            <div className="form-empty">

                                <span>
                                    📦
                                </span>

                                <strong>
                                    No products available
                                </strong>

                                <p>
                                    Add a product first
                                    before creating an
                                    auction.
                                </p>

                                <Link
                                    to="/seller/products/add"
                                    className="auction-primary-button"
                                >
                                    Add Product
                                </Link>

                            </div>

                        ) : (

                            <select
                                name="product"
                                value={
                                    formData.product
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    Select a product
                                </option>

                                {products.map(
                                    (product) => (
                                        <option
                                            key={
                                                product._id
                                            }
                                            value={
                                                product._id
                                            }
                                        >
                                            {product.name}{" "}
                                            — ₹
                                            {Number(
                                                product.price ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </option>
                                    )
                                )}

                            </select>
                        )}

                    </div>

                    <div className="auction-form-section">

                        <h2>
                            2. Starting Price
                        </h2>

                        <p>
                            Set the minimum price
                            from which buyers can
                            start bidding.
                        </p>

                        <div className="auction-money-input">

                            <span>
                                ₹
                            </span>

                            <input
                                type="number"
                                name="startingPrice"
                                min="1"
                                step="1"
                                placeholder="Enter starting price"
                                value={
                                    formData.startingPrice
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>

                    <div className="auction-form-section">

                        <h2>
                            3. Auction Schedule
                        </h2>

                        <p>
                            Decide when your auction
                            starts and ends.
                        </p>

                        <div className="auction-date-grid">

                            <div>

                                <label>
                                    Start Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={
                                        formData.startTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div>

                                <label>
                                    End Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={
                                        formData.endTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    <div className="auction-form-info">

                        <span>
                            💡
                        </span>

                        <div>

                            <strong>
                                How it works
                            </strong>

                            <p>
                                Buyers will bid above
                                your starting price.
                                The highest bidder when
                                the auction ends becomes
                                the winner.
                            </p>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="create-auction-submit"
                        disabled={
                            loading ||
                            products.length === 0
                        }
                    >
                        {loading
                            ? "Creating Auction..."
                            : "🔨 Create Auction"}
                    </button>

                </form>

            </section>

        </main>
    );
};

export default CreateAuction;