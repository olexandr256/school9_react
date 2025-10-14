import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API_URL_BACKEND from "../../config";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Перевірка...");
    const token = searchParams.get("token");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${API_URL_BACKEND}/auth/verify-email?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setMessage(data.message || "Email підтверджено успішно!");
                } else {
                    setMessage(data.message || "Недійсний або прострочений токен.");
                }
            } catch (err) {
                setMessage("Помилка з'єднання з сервером.");
            }
        };

        if (token) {
            verify();
        } else {
            setMessage("Токен відсутній!");
        }
    }, [token]);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Підтвердження email</h3>
                <div className="alert alert-info text-center">{message}</div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
