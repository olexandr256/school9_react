import React from 'react';
import Header from '../pages/Admin/components/Header';
import Footer from '../pages/Admin/components/Footer';
import {Outlet} from "react-router-dom";

const SiteLayout = () => {
    return (
        <div className="site-wrapper">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default SiteLayout;