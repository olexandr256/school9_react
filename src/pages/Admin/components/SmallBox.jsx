import React from 'react';

const SmallBox = ({ color, icon, title, value, link }) => (
    <div className={`small-box bg-${color}`}>
        <div className="inner">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
        <div className="icon">
            <i className={icon}></i>
        </div>
        <a href={link} className="small-box-footer">
            More info <i className="fas fa-arrow-circle-right"></i>
        </a>
    </div>
);

export default SmallBox;