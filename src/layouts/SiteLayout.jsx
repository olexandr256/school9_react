import React from 'react';
import {Outlet} from "react-router-dom";

const SiteLayout = () => {
    return (
        <div className="site-wrapper">

                <Outlet />{/* Тут рендеряться Home/About з їхнім <main> */}

        </div>
    );
};

export default SiteLayout;