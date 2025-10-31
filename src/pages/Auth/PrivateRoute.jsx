import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Якщо немає токена або користувача, перенаправляємо на логін
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Додаткова перевірка структури даних
    try {
        const userData = JSON.parse(user);
        if (!userData.accessToken) {
            throw new Error('Invalid user data');
        }
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;