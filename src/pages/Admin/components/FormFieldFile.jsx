// src/components/FormFieldFile.js
import React, { useState, useRef } from "react";
import { useToast } from "./GlobalToasts";
import "./FormField.css";

const FormFieldFile = ({
                           label = "Файл",
                           id,
                           endpoint,
                           token,
                           fieldName = "file",
                           buttonText = "Завантажити",
                           onSuccess,
                       }) => {
    const [fileName, setFileName] = useState("Виберіть файл");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : "Виберіть файл");
    };

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.warning("Будь ласка, виберіть файл перед завантаженням");
            return;
        }

        if (!endpoint || !token) {
            toast.error("Помилка конфігурації (endpoint або token відсутній)");
            return;
        }

        const formData = new FormData();
        formData.append(fieldName, file);

        setIsLoading(true);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Помилка завантаження файлу: ${response.status}`);
            }

            const data = await response.json();
            toast.success("Файл успішно завантажено!");
            setFileName("Виберіть файл");
            fileInputRef.current.value = null;
            onSuccess?.(data);
        } catch (error) {
            console.error("Помилка:", error);
            toast.error("Не вдалося завантажити файл. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-group col-md-12">
            <label htmlFor={id}>{label}</label>
            <div className="input-group">
                <div className="custom-file">
                    <input
                        type="file"
                        className="custom-file-input"
                        id={id}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    <label className="custom-file-label" htmlFor={id}>
                        {fileName}
                    </label>
                </div>
                <div className="input-group-append">
                    <button
                        type="button"
                        className={`input-group-text btn btn-primary ${isLoading ? "disabled" : ""}`}
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? "Завантаження..." : buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormFieldFile;
