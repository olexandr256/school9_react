import React from 'react';
import { Outlet } from "react-router-dom";
import Header from "../pages/Admin/components/Header";
import Sidebar from "../pages/Admin/components/Sidebar";
import Footer from "../pages/Admin/components/Footer";
import ToastProvider from '../pages/Admin/components/GlobalToasts';

const AdminLayout = () => {
    return (
        <div className="wrapper">
            {/* Preloader */}
            <div className="preloader flex-column justify-content-center align-items-center">
                <img className="animation__shake" src="dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60" />
            </div>

            <Header />
            <Sidebar />

            {/* Content Wrapper */}
            <div className="content-wrapper">
                <ToastProvider>
                    <Outlet />
                </ToastProvider>
            </div>

            <Footer />

            {/* Control Sidebar */}
            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
        </div>
    );
};

export default AdminLayout;