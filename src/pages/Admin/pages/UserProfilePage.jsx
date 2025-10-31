import React, { useState, useEffect } from "react";
import { useToast } from "../components/GlobalToasts";
import "./EmailForm.css";

import API_URL_BACKEND from "../../../config";
import FormField from "../components/FormField";
import FormFieldFile from "../components/FormFieldFile";
import FormFieldSelectMultiple from "../components/FormFieldSelectMultiple";
import FormFieldSelectMultipleRoles from "../components/FormFieldSelectMultipleRoles";

const UserProfilePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [userData, setUserData] = useState(null);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true); // ✅ додано

    const toast = useToast();

    const getAuthToken = () => localStorage.getItem("authToken");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getAuthToken();

                if (!token) {
                    setIsLoadingUserData(false);
                    toast.error("Токен авторизації не знайдено. Будь ласка, увійдіть знову.");
                    return;
                }

                const response = await fetch(`${API_URL_BACKEND}/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Помилка сервера: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);

                if (data.email) setEmail(data.email);
                if (data.fullName) setFullName(data.fullName);

                toast.success("Дані профілю успішно завантажено", "Успіх!");
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
                toast.error(
                    "Не вдалося завантажити дані профілю. Спробуйте оновити сторінку.",
                    "Помилка завантаження"
                );
            } finally {
                setIsLoadingUserData(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoadingUserData) {
        return (
            <section className="content text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Завантаження...</span>
                </div>
                <p className="mt-3">Завантаження даних профілю...</p>
            </section>
        );
    }

    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Профіль користувача</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="/">Головна</a>
                                </li>
                                <li className="breadcrumb-item active">Профіль</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-primary">
                                <div className="card-header">
                                    <h3 className="card-title">Основні дані</h3>
                                    {userData && (
                                        <div className="card-tools">
                      <span
                          className={`badge ${
                              userData.emailVerified
                                  ? "badge-success"
                                  : "badge-warning"
                          }`}
                      >
                        {userData.emailVerified
                            ? "Email підтверджено"
                            : "Email не підтверджено"}
                      </span>
                                            {userData.roles?.includes("ROLE_USER") && (
                                                <span className="badge badge-info ml-1">Користувач</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <form>
                                    <div className="card-body">
                                        <FormField
                                            label="Повне ім'я"
                                            id="fullName"
                                            placeholder="Введіть повне ім'я"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            endpoint={`${API_URL_BACKEND}/users/updateFullName`}
                                            token={getAuthToken()}
                                            fieldName="fullName"
                                            onSuccess={(data) => {
                                                console.log("Ім'я оновлено:", data);
                                                setUserData((prev) => ({ ...prev, fullName }));
                                            }}
                                        />

                                        <FormField
                                            label="Email"
                                            type="email"
                                            id="email"
                                            placeholder="Електронна пошта"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            endpoint={`${API_URL_BACKEND}/users/updateEmail`}
                                            token={getAuthToken()}
                                            fieldName="email"
                                            onSuccess={(data) =>
                                                console.log("Email оновлено:", data)
                                            }
                                        />

                                        <FormField
                                            label="Пароль"
                                            type="password"
                                            id="password"
                                            placeholder="Введіть новий пароль"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endpoint={`${API_URL_BACKEND}/users/updatePassword`}
                                            token={getAuthToken()}
                                            fieldName="password"
                                            onSuccess={() => setPassword("")}
                                        />

                                        <FormFieldFile
                                            label="Аватар користувача"
                                            id="avatarUpload"
                                            endpoint={`${API_URL_BACKEND}/users/uploadAvatar`}
                                            token={getAuthToken()}
                                            fieldName="avatar"
                                            onSuccess={(data) => {
                                                console.log("Аватар оновлено:", data);
                                                toast.success("Аватар оновлено успішно!");
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    avatarUrl: data.avatarUrl,
                                                }));
                                            }}
                                        />

                                        <FormFieldSelectMultipleRoles
                                            label="Ролі користувача"
                                            id="rolesSelect"
                                            endpointFetch={`${API_URL_BACKEND}/roles/all`}
                                            endpointUpdate={`${API_URL_BACKEND}/users/me/roles`}
                                            token={getAuthToken()}
                                            onSuccess={(data) => {
                                                console.log("Ролі оновлено:", data);
                                                toast.success("Ролі успішно оновлено!");

                                                setUserData((prev) => ({
                                                    ...prev,
                                                    roles: Array.isArray(data.roles)
                                                        ? data.roles.map((r) => (typeof r === "string" ? r : r.name))
                                                        : prev.roles,
                                                }));
                                            }}

                                        />

                                        {userData && (


                                            <div className="form-group col-md-12">
                                                <div className="alert alert-info">
                                                    <h6>Інформація про профіль:</h6>
                                                    <ul className="mb-0">
                                                        <li>
                                                            Email підтверджено:{" "}
                                                            {userData.emailVerified ? "Так" : "Ні"}
                                                        </li>
                                                        <li>
                                                            Ролі:{" "}
                                                            {userData.roles
                                                                ? userData.roles.join(", ")
                                                                : "Немає"}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="exampleCheck1"
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="exampleCheck1"
                                            >
                                                Погодитись
                                            </label>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary">
                                            Надіслати
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserProfilePage;
