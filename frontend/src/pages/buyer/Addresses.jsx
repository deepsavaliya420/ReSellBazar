import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getAddresses,
    addAddress,
    deleteAddress
} from "../../services/addressApi";

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false
    });

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const data = await getAddresses();

            setAddresses(
                Array.isArray(data)
                    ? data
                    : data.addresses || []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load addresses."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await addAddress(formData);

            setMessage("Address added successfully.");

            setFormData({
                fullName: "",
                mobile: "",
                addressLine: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
                isDefault: false
            });

            await loadAddresses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add address."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) {
            return;
        }

        try {
            await deleteAddress(id);
            setMessage("Address deleted.");
            await loadAddresses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete address."
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

            <main className="page-container">
                <div className="page-header">
                    <h1>My Addresses</h1>
                    <p>Manage your delivery addresses.</p>
                </div>

                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <section className="form-section">
                    <h2>Add New Address</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="addressLine"
                            placeholder="Address"
                            value={formData.addressLine}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />

                        <label>
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                            />
                            Make this my default address
                        </label>

                        <button type="submit">
                            Add Address
                        </button>
                    </form>
                </section>

                <section>
                    <h2>Saved Addresses</h2>

                    {addresses.length === 0 ? (
                        <div className="empty-state">
                            No addresses found.
                        </div>
                    ) : (
                        <div className="address-list">
                            {addresses.map((address) => (
                                <div
                                    className="address-card"
                                    key={address._id}
                                >
                                    <h3>
                                        {address.fullName}
                                    </h3>

                                    <p>
                                        {address.addressLine}
                                    </p>

                                    <p>
                                        {address.city},{" "}
                                        {address.state}{" "}
                                        {address.pincode}
                                    </p>

                                    <p>
                                        {address.country}
                                    </p>

                                    <p>
                                        Mobile:{" "}
                                        {address.mobile}
                                    </p>

                                    {address.isDefault && (
                                        <strong>
                                            Default Address
                                        </strong>
                                    )}

                                    <br />

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                address._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Addresses;