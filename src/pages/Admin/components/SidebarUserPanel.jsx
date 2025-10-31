import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL_BACKEND from "../../../config";

const SidebarUserPanel = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 📥 Отримуємо локальні дані з localStorage і підвантажуємо актуальні з бекенду
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                fetchUserFromBackend(parsedUser); // 👈 підтягнути оновлені дані
            } catch (error) {
                console.error("Помилка парсингу даних користувача:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    // ✅ Оновлення даних користувача з бекенду
    const fetchUserFromBackend = async (parsedUser) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL_BACKEND}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            } else {
                console.error("Не вдалося отримати користувача:", res.status);
            }
        } catch (err) {
            console.error("Помилка отримання даних користувача:", err);
        }
    };

    // 🚪 Вихід
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            if (token) {
                await fetch(`${API_URL_BACKEND}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }
        } catch (error) {
            console.error("Помилка при виході:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };

    const getUserName = () => {
        if (!user) return "Користувач";
        return (
            user.fullName ||
            user.username ||
            user.name ||
            user.email?.split("@")[0] ||
            "Користувач"
        );
    };

    const getAvatarUrl = () => {
        if (!user?.avatarUrl && !user?.avatar) {
            return "/dist/img/avatar4.png";
        }
        const avatarPath = user.avatarUrl || user.avatar;
        if (avatarPath.startsWith("http")) {
            return avatarPath;
        }
        return `${API_URL_BACKEND}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
    };

    if (!user) {
        return (
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="image">
                    <img
                        src="/dist/img/avatar4.png"
                        className="img-circle elevation-2"
                        alt="User Avatar"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                </div>
                <div className="info">
                    <span className="d-block text-muted">Завантаження...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
            <div className="image">
                <img
                    src={getAvatarUrl()}
                    onError={(e) => (e.target.src = "/dist/img/avatar4.png")}
                    className="img-circle elevation-2"
                    alt="User Avatar"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
            </div>

            <div className="info" style={{ flex: 1 }}>
                <div className="d-flex justify-content-between align-items-center">
                    <Link to="/profile" className="d-block">
                        {getUserName()}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm btn-outline-danger"
                        title="Вийти"
                        style={{
                            border: "none",
                            background: "transparent",
                            padding: "4px 8px",
                            marginLeft: "10px",
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarUserPanel;
