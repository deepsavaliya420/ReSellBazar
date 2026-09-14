import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
                setLoading(true);
                setError("");

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
                    ? `/buyer/orders/${order._id}`
                    : "/buyer/orders"
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
            <div className="checkout-page">
                <Loading />
            </div>
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
        <div className="checkout-page">
            <div className="checkout-container">

                <div className="checkout-header">
                    <div>
                        <span className="checkout-label">
                            COMPLETE YOUR PURCHASE
                        </span>

                        <h1>Checkout</h1>

                        <p>
                            Review your order, select your
                            delivery address and place your order.
                        </p>
                    </div>

                    <div className="checkout-header-icon">
                        💳
                    </div>
                </div>

                <ErrorMessage message={error} />

                {items.length === 0 ? (
                    <div className="checkout-empty">
                        <div className="checkout-empty-icon">
                            🛒
                        </div>

                        <h2>Your cart is empty</h2>

                        <p>
                            Add some products to your cart
                            before proceeding to checkout.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Browse Products →
                        </button>
                    </div>
                ) : (
                    <form
                        className="checkout-layout"
                        onSubmit={handlePlaceOrder}
                    >

                        <div className="checkout-main">

                            <section className="checkout-section">
                                <div className="checkout-section-header">
                                    <div className="checkout-section-icon">
                                        📦
                                    </div>

                                    <div>
                                        <h2>Order Items</h2>
                                        <p>
                                            {items.length}{" "}
                                            {items.length === 1
                                                ? "item"
                                                : "items"}{" "}
                                            in your order
                                        </p>
                                    </div>
                                </div>

                                <div className="checkout-items">
                                    {items.map((item) => (
                                        <div
                                            className="checkout-item"
                                            key={
                                                item.product?._id ||
                                                item._id
                                            }
                                        >
                                            <div className="checkout-item-image">
                                                {item.product
                                                    ?.images
                                                    ?.length ? (
                                                    <img
                                                        src={
                                                            item
                                                                .product
                                                                .images[0]
                                                        }
                                                        alt={
                                                            item
                                                                .product
                                                                .name
                                                        }
                                                    />
                                                ) : (
                                                    <span>
                                                        📦
                                                    </span>
                                                )}
                                            </div>

                                            <div className="checkout-item-info">
                                                <h3>
                                                    {
                                                        item
                                                            .product
                                                            ?.name
                                                    }
                                                </h3>

                                                <span>
                                                    Quantity:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>
                                            </div>

                                            <div className="checkout-item-price">
                                                ₹
                                                {Number(
                                                    item
                                                        .product
                                                        ?.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="checkout-section">
                                <div className="checkout-section-header">
                                    <div className="checkout-section-icon">
                                        📍
                                    </div>

                                    <div>
                                        <h2>
                                            Delivery Address
                                        </h2>

                                        <p>
                                            Select where you
                                            want your order
                                            delivered.
                                        </p>
                                    </div>
                                </div>

                                {addresses.length === 0 ? (
                                    <div className="checkout-no-address">
                                        <span>📍</span>

                                        <div>
                                            <strong>
                                                No addresses found
                                            </strong>

                                            <p>
                                                Add a delivery
                                                address before
                                                placing your order.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/buyer/addresses"
                                                )
                                            }
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="address-options">
                                        {addresses.map(
                                            (address) => (
                                                <label
                                                    key={
                                                        address._id
                                                    }
                                                    className={`address-option ${
                                                        selectedAddress ===
                                                        address._id
                                                            ? "selected"
                                                            : ""
                                                    }`}
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

                                                    <div className="address-radio">
                                                        <span />
                                                    </div>

                                                    <div className="address-content">
                                                        <div className="address-name-row">
                                                            <strong>
                                                                {
                                                                    address.fullName
                                                                }
                                                            </strong>

                                                            {address.isDefault && (
                                                                <span className="default-address">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p>
                                                            {
                                                                address.addressLine
                                                            }
                                                        </p>

                                                        <p>
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
                                                        </p>
                                                    </div>
                                                </label>
                                            )
                                        )}
                                    </div>
                                )}
                            </section>

                            <section className="checkout-section">
                                <div className="checkout-section-header">
                                    <div className="checkout-section-icon">
                                        💰
                                    </div>

                                    <div>
                                        <h2>
                                            Payment Method
                                        </h2>

                                        <p>
                                            Choose how you want
                                            to pay.
                                        </p>
                                    </div>
                                </div>

                                <div className="payment-options">

                                    <label
                                        className={`payment-option ${
                                            paymentMethod ===
                                            "cod"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
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

                                        <div className="payment-icon">
                                            💵
                                        </div>

                                        <div>
                                            <strong>
                                                Cash on Delivery
                                            </strong>

                                            <span>
                                                Pay when your
                                                order arrives
                                            </span>
                                        </div>
                                    </label>

                                    <label
                                        className={`payment-option ${
                                            paymentMethod ===
                                            "online"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
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

                                        <div className="payment-icon">
                                            💳
                                        </div>

                                        <div>
                                            <strong>
                                                Online Payment
                                            </strong>

                                            <span>
                                                Pay securely
                                                online
                                            </span>
                                        </div>
                                    </label>

                                </div>
                            </section>

                        </div>

                        <aside className="checkout-summary">

                            <div className="checkout-summary-header">
                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h2>
                                    Your Order
                                </h2>
                            </div>

                            <div className="checkout-summary-row">
                                <span>
                                    Items
                                </span>

                                <strong>
                                    {items.length}
                                </strong>
                            </div>

                            <div className="checkout-summary-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="checkout-summary-row">
                                <span>
                                    Delivery
                                </span>

                                <strong className="free">
                                    FREE
                                </strong>
                            </div>

                            <div className="checkout-summary-divider" />

                            <div className="checkout-total">
                                <div>
                                    <span>
                                        Total
                                    </span>

                                    <small>
                                        Inclusive of all
                                        applicable charges
                                    </small>
                                </div>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <button
                                type="submit"
                                className="checkout-place-button"
                                disabled={
                                    placingOrder ||
                                    !selectedAddress ||
                                    addresses.length === 0
                                }
                            >
                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"}

                                {!placingOrder && (
                                    <span>→</span>
                                )}
                            </button>

                            <div className="checkout-secure">
                                <span>🔒</span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <small>
                                        Your order information
                                        is protected.
                                    </small>
                                </div>
                            </div>

                        </aside>

                    </form>
                )}

            </div>
        </div>
    );
};

export default Checkout;