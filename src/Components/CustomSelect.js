import React from 'react';
import Select from 'react-select' 

const customStyles = {
    container: (provided) => ({
      ...provided,
      display: 'inline-block',
      width: '100px',
      minHeight: '1px',
      textAlign: 'left',
      border: 'none',
    }),
    control: (provided) => ({
      ...provided,
      border: '2px solid #757575',
      borderRadius: '0',
      minHeight: '1px',
      height: '24px',
    }),
    input: (provided) => ({
      ...provided,
      minHeight: '1px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      minHeight: '1px',
      width:'10px',
      height:'10px',
      paddingTop: '0',
      paddingBottom: '0',
      color: '#757575',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      minHeight: '1px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: '1px',
      height: '24px',
      width: '100px',
      paddingTop: '0',
      paddingBottom: '0',
      fontSize: '14px',
    }),
    singleValue: (provided) => ({
      ...provided,
      minHeight: '1px',
      paddingBottom: '2px',
    }),
  };


export const CustomSelect = (props) => {

    const {id, className, options, defaultValue, onChange, width} = props;

    return (
        <Select
            id={id}
            className={className}
            options={options}
            defaultValue={defaultValue}
            onChange={onChange}
            styles={customStyles}
        >
        </Select>
    )
}