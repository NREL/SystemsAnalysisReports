import React from 'react';
import { useTranslation } from "react-i18next";
import './Tab.css';

export const Tab = (props) => {
    const { icon, label } = props;
    const { t } = useTranslation();
   
return (
    <div className="tab-control">
        <button className="tab-button">
            <img src={icon}/>
            {t(label)}
        </button>
    </div>
)
}