
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(
        location.state?.registered ? "Account created successfully! Please log in." : ""
    );
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {

            const formData = new URLSearchParams();

            formData.append("username", form.username);
            formData.append("password", form.password);

            const response = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-shell">

                {/* Left branding section */}
                <div className="auth-brand">

                    <div className="brand-logo">
                        <span className="brand-icon">T</span>
                        <span>TaskFlow</span>
                    </div>

                    <div className="brand-content">

                        <span className="brand-label">
                            YOUR PRODUCTIVITY PARTNER
                        </span>

                        <h1>
                            Manage your work.
                            <br />
                            Achieve more.
                        </h1>

                        <p>
                            Organize your tasks, track your progress,
                            and stay focused on what matters most.
                        </p>

                        <div className="brand-feature">
                            <span>✓</span>
                            Organize your daily tasks
                        </div>

                        <div className="brand-feature">
                            <span>✓</span>
                            Track your productivity
                        </div>

                        <div className="brand-feature">
                            <span>✓</span>
                            Manage everything in one place
                        </div>

                    </div>

                    <div className="brand-footer">
                        © 2026 TaskFlow. All rights reserved.
                    </div>

                </div>

                {/* Right login section */}
                <div className="auth-form-section">

                    <div className="auth-form-wrapper">

                        <div className="mobile-logo">
                            <span className="brand-icon">T</span>
                            TaskFlow
                        </div>

                        <span className="form-label">
                            WELCOME BACK
                        </span>

                        <h2>Sign in to your account</h2>

                        <p className="form-subtitle">
                            Enter your details to access your dashboard.
                        </p>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <div className="password-label">
                                    <label htmlFor="password">
                                        Password
                                    </label>
                                </div>

                                <div className="password-wrapper">

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                                {!loading && <span>→</span>}
                            </button>

                        </form>

                        <div className="auth-switch">
                            Don't have an account?
                            <Link to="/register"> Create account</Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
