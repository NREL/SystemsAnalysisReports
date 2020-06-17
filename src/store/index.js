import React, { useState, createContext } from 'react';

// Uses React Hooks Context API to provide a global store for state

export const Context = createContext();

export const Provider = ({ children }) => {
  // Provide global state hooks
  const [ sectionSelection, setSectionSelection ] = useState('zone_load_summary');
  const [ unitSystem, setUnitSystem ] = useState('si');
  const [ locale, setLocale ] = useState('en');
  const [ zoneId, setZoneId ] = useState(0);
  const [ systemId, setSystemId ] = useState(0);
  const [ coilId, setCoilId ] = useState(0);
  const [ pdfPrint, setPdfPrint ] = useState(false);
  const [ animationEnable, setAnimationEnable ] = useState(true);

  // Make the context object:
  const mainContext = {
    sectionSelection,
    setSectionSelection,
    unitSystem,
    setUnitSystem,
    locale,
    setLocale,
    zoneId,
    setZoneId,
    systemId,
    setSystemId,
    coilId,
    setCoilId,
    pdfPrint,
    setPdfPrint,
    animationEnable,
    setAnimationEnable
  };

  // pass the value in provider and return
  return <Context.Provider value={mainContext}>{children}</Context.Provider>;
};

