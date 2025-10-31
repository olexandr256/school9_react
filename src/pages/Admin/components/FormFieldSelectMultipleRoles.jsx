// src/components/FormFieldSelectMultipleRoles.js
import React, { useState, useEffect } from "react";
import FormFieldSelectMultiple from "./FormFieldSelectMultiple";
import { useToast } from "./GlobalToasts";
import API_URL_BACKEND from "../../../config";

const FormFieldSelectMultipleRoles = ({
                                          label,
                                          id,
                                          placeholder = "Оберіть ролі",
                                          endpointFetch,
                                          endpointUpdate,
                                          token,
                                          fieldName = "roles",
                                          onSuccess,
                                      }) => {
    const [options, setOptions] = useState([]);
    const [defaultValue, setDefaultValue] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);

                // 1️⃣ Отримуємо всі ролі
                const resAll = await fetch(endpointFetch, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resAll.ok) throw new Error("Помилка завантаження списку ролей");
                const allRoles = await resAll.json();

                const mappedOptions = allRoles.map((role) => ({
                    value: role.name,
                    label: role.name,
                }));
                setOptions(mappedOptions);

                // 2️⃣ Отримуємо поточні ролі користувача
                const resUser = await fetch(`${API_URL_BACKEND}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resUser.ok)
                    throw new Error("Помилка завантаження ролей користувача");
                const userData = await resUser.json();

                const userRoles = (userData.roles || []).map((r) =>
                    typeof r === "string" ? r : r.name
                );

                // 3️⃣ Формуємо defaultValue для react-select
                const selected = mappedOptions.filter((opt) =>
                    userRoles.includes(opt.value)
                );

                setDefaultValue(selected);
            } catch (err) {
                console.error(err);
                toast.error("Не вдалося завантажити ролі");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [endpointFetch, token]);

    if (loading) {
        return (
            <div className="form-group col-md-12">
                <label>{label}</label>
                <div className="text-muted small">Завантаження ролей...</div>
            </div>
        );
    }

    return (
        <FormFieldSelectMultiple
            label={label}
            id={id}
            placeholder={placeholder}
            options={options}
            defaultValue={defaultValue} // 👈 ці ролі будуть видимі у полі
            endpoint={endpointUpdate}
            token={token}
            fieldName={fieldName}
            onSuccess={onSuccess}
        />
    );
};

export default FormFieldSelectMultipleRoles;
