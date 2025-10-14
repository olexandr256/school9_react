import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // додано useNavigate
import API_URL_BACKEND from "../../config";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate(); // хук для навігації
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!token) {
            setError("Невірне або прострочене посилання.");
            return;
        }

        if (password.length < 6) {
            setError("Пароль має містити мінімум 6 символів.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Паролі не співпадають.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL_BACKEND}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Не вдалося змінити пароль.");
            } else {
                setMessage("Пароль успішно змінено! Переадресація на сторінку входу...");
                setPassword("");
                setConfirmPassword("");

                // Перекидання на сторінку авторизації через 2 секунди
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError("Помилка підключення до сервера.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Скидання паролю</h3>

                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success text-center" role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Новий пароль */}
                    <div className="mb-3">
                        <label className="form-label">Новий пароль</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary border"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Підтвердження паролю */}
                    <div className="mb-3">
                        <label className="form-label">Підтвердіть пароль</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary border"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Оновлюю...
                            </>
                        ) : (
                            "Оновити пароль"
                        )}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>
                        <Link to="/login">Повернутись до входу</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
