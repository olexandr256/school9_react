import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../pages/Admin/components/Header";
import Footer from "../pages/Admin/components/Footer";

const AuthLayout = () => {
    return (
        <>
            <div className="site-wrapper">
                <Outlet />{/* Тут рендеряться Home/About з їхнім <main> */}
            </div>
        </>
    );
};

export default AuthLayout;