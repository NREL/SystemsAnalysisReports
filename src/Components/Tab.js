import React from 'react';
import { useTranslation } from "react-i18next";
import './Tab.css';

export const Tab = (props) => {
    const { name, icon, label, isActive, handleSelect } = props;
    const { t } = useTranslation();

return (
    <div className={`tab-control ${isActive ? "tab-active" : "tab-inactive"}`}>
        <button
            onClick={() => handleSelect(name)}
            style={{
                    display: 'inline-block',
                    height: '24px',
                    outline: 'none',
                    border: 'none',
                    borderRight: '1px solid #808080',
                    backgroundColor: (isActive ? "#FFFFFF":  "#EEEEEE"),
            }}
        >
            <img src={icon} style={{paddingRight: '5px'}}/>
            {t(label)}
        </button>
    </div>
)
}