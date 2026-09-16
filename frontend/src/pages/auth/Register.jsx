import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { register } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            mobile: "",
            password: "",
            role: "buyer"
        });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await register(formData);

            setSuccess(
                "Registration successful. Please login."
            );

            const destination =
                location.state?.from;

            setTimeout(() => {
                navigate("/login", {
                    state: {
                        from: destination
                    }
                });
            }, 1000);

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

                <h1>
                    Create Account
                </h1>

                <p>
                    Join ReSellBazar today.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >

                    <label>
                        Name
                    </label>

                    <input
                        name="name"
                        value={
                            formData.name
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter your name"
                        required
                    />

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={
                            formData.email
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter your email"
                        required
                    />

                    <label>
                        Mobile
                    </label>

                    <input
                        name="mobile"
                        value={
                            formData.mobile
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter mobile number"
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={
                            formData.password
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Create password"
                        required
                    />

                    <label>
                        Account Type
                    </label>

                    <select
                        name="role"
                        value={
                            formData.role
                        }
                        onChange={
                            handleChange
                        }
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

                    <Link
                        to="/login"
                        state={{
                            from:
                                location.state?.from
                        }}
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;