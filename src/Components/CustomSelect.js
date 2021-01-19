import React from 'react';
import Select from 'react-select'
import {useTranslation} from "react-i18next";

const customStyles = {
        container: (base) => ({
            ...base,
            display: 'inline-block',
            overflow: 'initial'
        }),
        control: (base) => ({
          ...base,
          backgroundColor: '#EEEEEE',
          minHeight: '24px',
          width: '100%',
          border: 'none',
          borderRadius: '2px',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: '#808080',
          cursor:'pointer',
          'svg':{
              width:'12px',
              height:'12px',
              '&hover':{
              color:'#808080',
              },
          },
          paddingTop: 0,
          paddingBottom: 0,
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
        }),
        clearIndicator: (base) => ({
          ...base,
          paddingTop: 0,
          paddingBottom: 0,
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            //position: 'unset',
            fontSize: '12px',
            textOverflow: "ellipsis",
            maxWidth: "90%",
            whiteSpace: "nowrap",
            overflow: "initial",
            position: "relative !important",
            display: "block",
            textAlign: 'right',
            height: '28px',
            padding: '2px 0px'
        }),
        menu: (base) => ({
            ...base,
            fontSize: '12px',
        }),
        singleValue: (base) => ({
            ...base,
            position: 'relative',
            transform: 'none',
            top: 'none',
            overflow: 'initial',
            marginRight: '0px',
            fontFamily: 'ArtifaktElement-Bold'
        })
      };

export const CustomSelect = (props) => {

    const {id, className, options, defaultValue, onChange, width} = props;

    return (
        <Select
            id={id}
            className={`"basic-single" ${className}`}
            classNamePrefix="select"
            defaultValue={defaultValue}
            name="color"
            options={options}
            styles={customStyles}
            onChange={onChange}
            isSearchable={false}
        />
    )
}