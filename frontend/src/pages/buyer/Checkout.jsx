import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getCart } from "../../services/cartApi";
import { getAddresses } from "../../services/addressApi";
import { createOrder } from "../../services/orderApi";

const Checkout = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("cod");

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cartData, addressData] =
                    await Promise.all([
                        getCart(),
                        getAddresses()
                    ]);

                setCart(cartData);

                const addressList = Array.isArray(
                    addressData
                )
                    ? addressData
                    : addressData.addresses || [];

                setAddresses(addressList);

                const defaultAddress =
                    addressList.find(
                        (address) =>
                            address.isDefault
                    );

                if (defaultAddress) {
                    setSelectedAddress(
                        defaultAddress._id
                    );
                } else if (addressList.length > 0) {
                    setSelectedAddress(
                        addressList[0]._id
                    );
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load checkout data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            setError(
                "Please select a delivery address."
            );
            return;
        }

        if (!cart?.items?.length) {
            setError("Your cart is empty.");
            return;
        }

        try {
            setPlacingOrder(true);
            setError("");

            const items = cart.items.map((item) => ({
                product:
                    item.product?._id ||
                    item.product,
                quantity: item.quantity
            }));

            const data = await createOrder({
                items,
                address: selectedAddress,
                paymentMethod
            });

            const order = data.order;

            navigate(
                order
                    ? `/orders/${order._id}`
                    : "/orders"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to place order."
            );
        } finally {
            setPlacingOrder(false);
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

    const items = cart?.items || [];

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(
                item.product?.price || 0
            ) *
                Number(item.quantity || 0),
        0
    );

    return (
        <>
            <Navbar />

            <main className="page-container">
                <div className="page-header">
                    <h1>Checkout</h1>
                    <p>
                        Review your order and place it.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {items.length === 0 ? (
                    <div className="empty-state">
                        <h2>Your cart is empty</h2>
                    </div>
                ) : (
                    <form
                        onSubmit={handlePlaceOrder}
                    >
                        <section>
                            <h2>Order Items</h2>

                            {items.map((item) => (
                                <div
                                    className="checkout-item"
                                    key={
                                        item.product?._id ||
                                        item._id
                                    }
                                >
                                    <h3>
                                        {
                                            item.product
                                                ?.name
                                        }
                                    </h3>

                                    <p>
                                        ₹
                                        {
                                            item.product
                                                ?.price
                                        }{" "}
                                        ×{" "}
                                        {item.quantity}
                                    </p>
                                </div>
                            ))}

                            <h2>
                                Total: ₹{total}
                            </h2>
                        </section>

                        <section>
                            <h2>
                                Delivery Address
                            </h2>

                            {addresses.length ===
                            0 ? (
                                <p>
                                    No addresses found.
                                    Add an address first.
                                </p>
                            ) : (
                                addresses.map(
                                    (address) => (
                                        <label
                                            key={
                                                address._id
                                            }
                                            className="address-option"
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={
                                                    address._id
                                                }
                                                checked={
                                                    selectedAddress ===
                                                    address._id
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setSelectedAddress(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span>
                                                {
                                                    address.fullName
                                                }
                                                <br />
                                                {
                                                    address.addressLine
                                                }
                                                <br />
                                                {
                                                    address.city
                                                }
                                                ,{" "}
                                                {
                                                    address.state
                                                }{" "}
                                                {
                                                    address.pincode
                                                }
                                            </span>
                                        </label>
                                    )
                                )
                            )}
                        </section>

                        <section>
                            <h2>
                                Payment Method
                            </h2>

                            <label>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={
                                        paymentMethod ===
                                        "cod"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />
                                Cash on Delivery
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online"
                                    checked={
                                        paymentMethod ===
                                        "online"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />
                                Online Payment
                            </label>
                        </section>

                        <button
                            type="submit"
                            disabled={
                                placingOrder ||
                                !selectedAddress
                            }
                        >
                            {placingOrder
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>
                    </form>
                )}
            </main>

            <Footer />
        </>
    );
};

export default Checkout;