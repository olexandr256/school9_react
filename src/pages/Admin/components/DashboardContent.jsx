import React from 'react';
import SmallBox from './SmallBox';

const DashboardContent = () => {
    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Dashboard</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard v1</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    {/* Small boxes */}
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <SmallBox
                                color="info"
                                icon="ion ion-bag"
                                title="New Orders"
                                value="150"
                                link="#"
                            />
                        </div>
                        {/* Додайте інші SmallBox компоненти */}
                    </div>

                    {/* Решта контенту дашборду */}
                </div>
            </section>
        </>
    );
};

export default DashboardContent;