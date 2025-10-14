import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_URL_BACKEND from "../../config";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Паролі не співпадають!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL_BACKEND}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    role: ["user"],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Помилка реєстрації");
                return;
            }

            setSuccessMessage(data.message);
        } catch (err) {
            setError("Не вдалося підключитись до сервера.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Реєстрація</h3>

                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}

                {successMessage ? (
                    <div className="alert alert-success text-center" role="alert">
                        {successMessage}
                    </div>
                ) : (
                    <>
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

                            <div className="mb-3">
                                <label className="form-label">Підтвердження паролю</label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary border"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        <i className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Завантаження...
                                    </>
                                ) : (
                                    "Зареєструватись"
                                )}
                            </button>
                        </form>
                    </>
                )}

                {!successMessage && (
                    <div className="text-center mt-3">
                        <small>
                            Вже маєте акаунт? <Link to="/">Увійти</Link>
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
