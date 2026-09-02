import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../components/context/AuthContext";
import PageTransition from "../components/PageTransition";

function SignupPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }

        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await register({
                name: name.trim(),
                email: email.trim(),
                password: password
            });
            navigate("/dashboard");
        } catch (err) {
            console.log("Signup Error:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#10131d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <PageTransition>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: "#171b27",
                        width: "100%",
                        maxWidth: "460px",
                        padding: "40px",
                        borderRadius: "20px",
                        border: "1px solid #2c3247",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                        color: "white"
                    }}
                >
                    {/* Header Branding */}
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "24px",
                                color: "white",
                                marginBottom: "12px"
                            }}
                        >
                            N
                        </div>
                        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 6px 0" }}>
                            Create your account
                        </h1>
                        <p style={{ color: "#aeb7d0", fontSize: "14px", margin: 0 }}>
                            Join Nexora AI for intelligent document research
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div
                            style={{
                                background: "rgba(239, 68, 68, 0.15)",
                                border: "1px solid #ef4444",
                                color: "#f87171",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                fontSize: "14px",
                                marginBottom: "20px"
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "18px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#aeb7d0", marginBottom: "6px" }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Khushi Chadda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "1px solid #2c3247",
                                    background: "#10131d",
                                    color: "white",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#aeb7d0", marginBottom: "6px" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "1px solid #2c3247",
                                    background: "#10131d",
                                    color: "white",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#aeb7d0", marginBottom: "6px" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "1px solid #2c3247",
                                    background: "#10131d",
                                    color: "white",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#aeb7d0", marginBottom: "6px" }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "1px solid #2c3247",
                                    background: "#10131d",
                                    color: "white",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "none",
                                background: loading ? "#44475a" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                color: "white",
                                fontWeight: "600",
                                fontSize: "15px",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Footer Navigation */}
                    <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#aeb7d0" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: "600" }}>
                            Login
                        </Link>
                    </div>
                </motion.div>
            </PageTransition>
        </div>
    );
}

export default SignupPage;
