// src/components/FormFieldSelectMultiple.js
import React, { useState } from "react";
import Select from "react-select";
import { useToast } from "./GlobalToasts";

const FormFieldSelectMultiple = ({
                                     label,
                                     id,
                                     placeholder = "Виберіть...",
                                     options = [],
                                     endpoint,
                                     token,
                                     fieldName = "values",
                                     defaultValue = [],
                                     onSuccess,
                                 }) => {
    const [selectedOptions, setSelectedOptions] = useState(defaultValue);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
    };

    const handleSubmit = async () => {
        if (!endpoint || !token) {
            toast.error("Помилка конфігурації (endpoint або token відсутній)");
            return;
        }

        const selectedValues = selectedOptions.map((opt) => opt.value);
        if (selectedValues.length === 0) {
            toast.warning("Виберіть хоча б один елемент");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [fieldName]: selectedValues }),
            });

            if (!response.ok) {
                throw new Error(`Помилка оновлення ${fieldName}`);
            }

            const data = await response.json();
            toast.success(`${label} успішно оновлено!`);
            onSuccess?.(data);
        } catch (error) {
            console.error("Помилка:", error);
            toast.error("Не вдалося оновити поле.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-group col-md-12">
            {label && <label htmlFor={id}>{label}</label>}
            <div className="d-flex">
                <div style={{ flex: 1, marginRight: "8px" }}>
                    <Select
                        id={id}
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isDisabled={isLoading}
                        styles={{
                            container: (provided) => ({ ...provided, width: "100%" }),
                        }}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? "Оновлення..." : "Зберегти"}
                </button>
            </div>
        </div>
    );
};

export default FormFieldSelectMultiple;
