import React from 'react';
import { useTranslation } from "react-i18next";
import './Tab.css';

export const Tab = (props) => {
    const { name, default_icon, selected_icon, label, isActive, handleSelect } = props;
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
                    borderRight: '1px solid #CCCCCC',
                    backgroundColor: (isActive ? "#FFFFFF":  "#EEEEEE"),
            }}
        >
            <img src={isActive ? selected_icon : default_icon } style={{paddingRight: '5px'}}/>
            {t(label)}
        </button>
    </div>
)
}