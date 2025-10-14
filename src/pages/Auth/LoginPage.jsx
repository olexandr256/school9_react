import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL_BACKEND from "../../config";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 стан для ока

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL_BACKEND}/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Помилка входу");
                return;
            }

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/dashboard");
        } catch (err) {
            setError("Не вдалося підключитись до сервера.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Вхід</h3>

                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary border"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Вхід...
                            </>
                        ) : (
                            "Увійти"
                        )}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>
                        <Link to="/forgot-password">Забули пароль?</Link>
                    </small>
                </div>

                <div className="text-center mt-3">
                    <small>
                        Немає акаунту? <Link to="/register">Реєстрація</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
