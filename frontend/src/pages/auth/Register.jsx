import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "buyer"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await register(formData);

            const role = data.user?.role || formData.role;

            if (role === "seller") {
                navigate("/seller");
            } else {
                navigate("/buyer");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>Create Account</h1>

                <p>Join ReSellBazar today</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Mobile</label>

                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter your mobile number"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />

                    <label>Account Type</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="buyer">
                            Buyer
                        </option>

                        <option value="seller">
                            Seller
                        </option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;