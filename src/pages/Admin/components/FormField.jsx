// src/components/FormField.js
import React, { useState } from "react";
import { useToast } from "./GlobalToasts"; // імпорт твого toast-хука
import "./FormField.css";

const FormField = ({
                       label,
                       type = "text",
                       id,
                       value,
                       placeholder,
                       onChange,
                       onKeyPress,
                       endpoint,            // API endpoint, наприклад /users/updateEmail
                       token,               // токен авторизації
                       fieldName,           // ключ поля, наприклад "email" або "fullName"
                       buttonText = "Зберегти",
                       disabled = false,
                       onSuccess,           // callback при успішному оновленні
                   }) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        if (!value) {
            toast.warning(`Будь ласка, введіть ${label.toLowerCase()}`);
            return;
        }

        if (!endpoint || !token || !fieldName) {
            console.error("FormField config error: missing endpoint, token, or fieldName");
            toast.error("Помилка конфігурації поля.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [fieldName]: value }),
            });

            if (!response.ok) {
                throw new Error(`Помилка оновлення ${fieldName}`);
            }

            const data = await response.json();
            toast.success(`${label} успішно оновлено!`);
            onSuccess?.(data);
        } catch (error) {
            console.error("Помилка:", error);
            toast.error(`Не вдалося оновити ${label.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        onKeyPress?.(e);
    };

    return (
        <div className="form-group col-md-12">
            {label && <label htmlFor={id}>{label}</label>}
            <div className="input-group">
                <input
                    type={type}
                    className={`form-control ${isLoading ? "loading" : ""}`}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || disabled}
                />
                <div className="input-group-append">
                    <button
                        type="button"
                        className={`btn btn-primary email-form-btn ${isLoading ? "loading" : ""}`}
                        onClick={handleSubmit}
                        disabled={isLoading || !value}
                    >
            <span className="button-text">
              {isLoading ? "Обробка..." : buttonText}
            </span>
                        {isLoading && (
                            <span className="button-loader">
                <span className="spinner"></span>
              </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormField;
