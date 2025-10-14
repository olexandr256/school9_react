import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    return user && user.accessToken ? children : <Navigate to="/" />;
};

export default PrivateRoute;
