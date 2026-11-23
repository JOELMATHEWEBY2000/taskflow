
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await API.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password
            });

            navigate("/login", {
                state: { registered: true }
            });

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed. Please try again."
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
                            START YOUR JOURNEY
                        </span>

                        <h1>
                            Turn your plans
                            <br />
                            into progress.
                        </h1>

                        <p>
                            Create your account and bring all your
                            tasks together in one simple workspace.
                        </p>

                        <div className="brand-feature">
                            <span>✓</span>
                            Simple task organization
                        </div>

                        <div className="brand-feature">
                            <span>✓</span>
                            Stay productive every day
                        </div>

                        <div className="brand-feature">
                            <span>✓</span>
                            Track your achievements
                        </div>

                    </div>

                    <div className="brand-footer">
                        © 2026 TaskFlow. All rights reserved.
                    </div>

                </div>

                {/* Right registration section */}
                <div className="auth-form-section">

                    <div className="auth-form-wrapper">

                        <div className="mobile-logo">
                            <span className="brand-icon">T</span>
                            TaskFlow
                        </div>

                        <span className="form-label">
                            GET STARTED
                        </span>

                        <h2>Create your account</h2>

                        <p className="form-subtitle">
                            Fill in your details to join TaskFlow.
                        </p>

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
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={50}
                                    autoComplete="username"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="password-wrapper">

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Minimum 8 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        minLength={8}
                                        autoComplete="new-password"
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

                            <div className="form-group">

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                                {!loading && <span>→</span>}
                            </button>

                        </form>

                        <div className="auth-switch">
                            Already have an account?
                            <Link to="/login"> Sign in</Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
