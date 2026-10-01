import {
    useEffect,
    useState
} from "react";

import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";

import {
    getSellerOrders,
    updateOrderStatus
} from "../../services/orderApi";

import "../../styles/auction.css";


const SellerOrders = () => {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingOrder, setUpdatingOrder] =
        useState("");


    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getSellerOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : data.orders || []
            );

        } catch (error) {

            setError(
                error.response?.data
                    ?.message ||
                "Failed to load seller orders."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadOrders();
    }, []);


    const handleStatusChange =
        async (
            orderId,
            status
        ) => {

            try {

                setUpdatingOrder(
                    orderId
                );

                setError("");

                await updateOrderStatus(
                    orderId,
                    status
                );

                await loadOrders();

            } catch (error) {

                setError(
                    error.response?.data
                        ?.message ||
                    "Failed to update order status."
                );

            } finally {

                setUpdatingOrder("");
            }
        };


    const formatPrice =
        (value) => {

            return Number(
                value || 0
            ).toLocaleString(
                "en-IN"
            );
        };


    const formatDate =
        (value) => {

            if (!value) {
                return "Not available";
            }

            return new Date(
                value
            ).toLocaleString(
                "en-IN"
            );
        };


    const getStatusClass =
        (status) => {

            if (
                status ===
                "delivered"
            ) {
                return "seller-order-status-delivered";
            }

            if (
                status ===
                "shipped"
            ) {
                return "seller-order-status-shipped";
            }

            if (
                status ===
                "out_for_delivery"
            ) {
                return "seller-order-status-out";
            }

            if (
                status ===
                "cancelled"
            ) {
                return "seller-order-status-cancelled";
            }

            if (
                status ===
                "confirmed"
            ) {
                return "seller-order-status-confirmed";
            }

            return "seller-order-status-placed";
        };


    const getStatusText =
        (status) => {

            if (
                status ===
                "out_for_delivery"
            ) {
                return "Out for Delivery";
            }

            if (
                status ===
                "delivered"
            ) {
                return "Delivered";
            }

            if (
                status ===
                "cancelled"
            ) {
                return "Cancelled";
            }

            if (
                status ===
                "confirmed"
            ) {
                return "Confirmed";
            }

            if (
                status ===
                "shipped"
            ) {
                return "Shipped";
            }

            return "Placed";
        };


    if (loading) {
        return <Loading />;
    }


    return (
        <main className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Seller Orders
                    </h1>

                    <p>
                        Manage orders containing
                        your products.
                    </p>
                </div>

                <div
                    className="seller-orders-count"
                >
                    {orders.length}{" "}
                    {orders.length === 1
                        ? "Order"
                        : "Orders"}
                </div>

            </div>


            <ErrorMessage
                message={error}
            />


            {orders.length === 0 ? (

                <div
                    className="seller-orders-empty"
                >

                    <div>
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        When customers purchase
                        your products, their orders
                        will appear here.
                    </p>

                </div>

            ) : (

                <div
                    className="seller-orders-list"
                >

                    {orders.map(
                        (order) => {

                            return (
                                <div
                                    className="seller-order-card"
                                    key={
                                        order._id
                                    }
                                >

                                    <div
                                        className="seller-order-header"
                                    >

                                        <div>

                                            <span>
                                                ORDER ID
                                            </span>

                                            <strong>
                                                #
                                                {order._id?.slice(
                                                    -8
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                ORDER DATE
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </strong>

                                        </div>


                                        <span
                                            className={`seller-order-status ${getStatusClass(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {getStatusText(
                                                order.orderStatus
                                            )}
                                        </span>

                                    </div>


                                    <div
                                        className="seller-order-body"
                                    >

                                        <div
                                            className="seller-order-products"
                                        >

                                            <div
                                                className="seller-order-section-title"
                                            >
                                                Your Products
                                            </div>


                                            {order.items?.map(
                                                (
                                                    item,
                                                    index
                                                ) => {

                                                    const product =
                                                        item.product ||
                                                        {};

                                                    const image =
                                                        product.images
                                                            ?.length >
                                                        0
                                                            ? product
                                                                  .images[0]
                                                            : null;

                                                    return (
                                                        <div
                                                            className="seller-order-product"
                                                            key={
                                                                item._id ||
                                                                index
                                                            }
                                                        >

                                                            <div
                                                                className="seller-order-product-image"
                                                            >

                                                                {image ? (

                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            product.name ||
                                                                            "Product"
                                                                        }
                                                                        onError={(
                                                                            event
                                                                        ) => {

                                                                            event.currentTarget.style.display =
                                                                                "none";

                                                                            if (
                                                                                event
                                                                                    .currentTarget
                                                                                    .nextElementSibling
                                                                            ) {

                                                                                event
                                                                                    .currentTarget
                                                                                    .nextElementSibling.style.display =
                                                                                    "flex";
                                                                            }
                                                                        }}
                                                                    />

                                                                ) : null}


                                                                <div
                                                                    className="seller-order-product-fallback"
                                                                    style={{
                                                                        display:
                                                                            image
                                                                                ? "none"
                                                                                : "flex"
                                                                    }}
                                                                >
                                                                    📦
                                                                </div>

                                                            </div>


                                                            <div
                                                                className="seller-order-product-info"
                                                            >

                                                                <strong>
                                                                    {product.name ||
                                                                        "Product"}
                                                                </strong>

                                                                <span>
                                                                    Quantity:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>

                                                                <span>
                                                                    Price: ₹
                                                                    {formatPrice(
                                                                        item.price
                                                                    )}
                                                                </span>

                                                            </div>


                                                            <strong
                                                                className="seller-order-product-total"
                                                            >
                                                                ₹
                                                                {formatPrice(
                                                                    Number(
                                                                        item.price ||
                                                                            0
                                                                    ) *
                                                                        Number(
                                                                            item.quantity ||
                                                                                0
                                                                        )
                                                                )}
                                                            </strong>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>


                                        <div
                                            className="seller-order-details"
                                        >

                                            <div
                                                className="seller-order-detail-box"
                                            >

                                                <span>
                                                    Customer
                                                </span>

                                                <strong>
                                                    {order.buyer
                                                        ?.name ||
                                                        "Customer"}
                                                </strong>

                                                <small>
                                                    {order.buyer
                                                        ?.email ||
                                                        ""}
                                                </small>

                                                {order.buyer
                                                    ?.mobile && (
                                                    <small>
                                                        {
                                                            order
                                                                .buyer
                                                                .mobile
                                                        }
                                                    </small>
                                                )}

                                            </div>


                                            <div
                                                className="seller-order-detail-box"
                                            >

                                                <span>
                                                    Payment
                                                </span>

                                                <strong>
                                                    {order.paymentMethod ===
                                                    "online"
                                                        ? "Online Payment"
                                                        : "Cash on Delivery"}
                                                </strong>

                                                <small>
                                                    Status:{" "}
                                                    {order.paymentStatus ||
                                                        "pending"}
                                                </small>

                                            </div>


                                            <div
                                                className="seller-order-detail-box"
                                            >

                                                <span>
                                                    Your Order Amount
                                                </span>

                                                <strong
                                                    className="seller-order-total"
                                                >
                                                    ₹
                                                    {formatPrice(
                                                        order.sellerTotalAmount
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    <div
                                        className="seller-order-footer"
                                    >

                                        <div
                                            className="seller-order-address"
                                        >

                                            <span>
                                                Delivery Address
                                            </span>

                                            <strong>
                                                {order.address
                                                    ? [
                                                          order
                                                              .address
                                                              .name,
                                                          order
                                                              .address
                                                              .addressLine1,
                                                          order
                                                              .address
                                                              .addressLine2,
                                                          order
                                                              .address
                                                              .city,
                                                          order
                                                              .address
                                                              .state,
                                                          order
                                                              .address
                                                              .pincode
                                                      ]
                                                          .filter(
                                                              Boolean
                                                          )
                                                          .join(
                                                              ", "
                                                          )
                                                    : "Address not available"}
                                            </strong>

                                        </div>


                                        <div
                                            className="seller-order-actions"
                                        >

                                            <label>
                                                Update Status
                                            </label>

                                            <select
                                                value={
                                                    order.orderStatus ||
                                                    "placed"
                                                }
                                                disabled={
                                                    updatingOrder ===
                                                    order._id
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleStatusChange(
                                                        order._id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >

                                                <option value="placed">
                                                    Placed
                                                </option>

                                                <option value="confirmed">
                                                    Confirmed
                                                </option>

                                                <option value="shipped">
                                                    Shipped
                                                </option>

                                                <option value="out_for_delivery">
                                                    Out for Delivery
                                                </option>

                                                <option value="delivered">
                                                    Delivered
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </main>
    );
};


export default SellerOrders;