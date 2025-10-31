import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {

    return(
        <>
            {/* Content Header (Page header) */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Невідома сторінка</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><Link to="/">Головна</Link></li>
                                <li className="breadcrumb-item active">Невідома сторінка</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="content">
                <div className="error-page">
                    <h2 className="headline text-warning"> 404</h2>

                    <div className="error-content">
                        <h3><i className="fas fa-exclamation-triangle text-warning"></i> Ой! Сторінку не знайдено.</h3>

                        <p>
                            Ми не змогли знайти сторінку, яку ви шукаєте.
                            Можливо, ви можете <Link to="/">повернутися на головну</Link> або спробувати використати пошук.
                        </p>

                        {/*<form className="search-form">*/}
                        {/*    <div className="input-group">*/}
                        {/*        <input*/}
                        {/*            type="text"*/}
                        {/*            name="search"*/}
                        {/*            className="form-control"*/}
                        {/*            placeholder="Пошук..."*/}
                        {/*        />*/}
                        {/*        <div className="input-group-append">*/}
                        {/*            <button*/}
                        {/*                type="submit"*/}
                        {/*                name="submit"*/}
                        {/*                className="btn btn-warning"*/}
                        {/*            >*/}
                        {/*                <i className="fas fa-search"></i>*/}
                        {/*            </button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</form>*/}
                    </div>
                </div>
            </section>
        </>
    );
}

export default NotFoundPage;