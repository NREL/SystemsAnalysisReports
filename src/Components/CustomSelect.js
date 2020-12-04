import React from 'react';
import Select from 'react-select' 

const customStyles = {
        container: (base) => ({
            ...base,
            display: 'inline-block',
        }),
        control: (base) => ({
          ...base,
          backgroundColor: '#EEEEEE',
          minHeight: '24px',
          width: '75px',
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
        valueContainer: (base) => ({
            ...base,
            //position: 'unset',
            fontSize: '12px',
          }),
        menu: (base) => ({
            ...base,
            fontSize: '12px',
        }),  
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
        />
    )
}