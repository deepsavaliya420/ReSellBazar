import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ErrorMessage from "../../components/ErrorMessage";

const SellerOrders = () => {
    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Seller Orders</h1>
                    <p>
                        Order management for sellers.
                    </p>
                </div>

                <ErrorMessage
                    message={
                        "Seller order listing requires a seller-specific backend endpoint. The current backend exposes /orders/all to admins only."
                    }
                />
            </div>

            <Footer />
        </>
    );
};

export default SellerOrders;