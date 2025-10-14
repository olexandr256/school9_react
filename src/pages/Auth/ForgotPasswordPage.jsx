import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_URL_BACKEND from "../../config";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Додано

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true); // початок завантаження

        try {
            const response = await fetch(`${API_URL_BACKEND}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Помилка при відновленні паролю.");
            } else {
                setMessage("Інструкції для відновлення паролю надіслані на ваш email.");
                setEmail("");
            }
        } catch (err) {
            setError("Не вдалося підключитись до сервера.");
        } finally {
            setLoading(false); // кінець завантаження
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Відновлення паролю</h3>

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
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading} // блокуємо під час завантаження
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Відправляю...
                            </>
                        ) : (
                            "Відновити пароль"
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

export default ForgotPasswordPage;
