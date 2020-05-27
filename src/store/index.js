import React, { useState, createContext } from 'react';

// Uses React Hooks Context API to provide a global store for state

export const Context = createContext();

export const Provider = ({ children }) => {
  // Provide global state hooks
  const [ sectionSelection, setSectionSelection ] = useState('zone_load_summary');
  const [ unitSystem, setUnitSystem ] = useState('si');
  const [ zoneId, setZoneId ] = useState(0);
  const [ pdfPrint, setPdfPrint ] = useState(false);

  // Make the context object:
  const mainContext = {
    sectionSelection,
    setSectionSelection,
    unitSystem,
    setUnitSystem,
    zoneId,
    setZoneId,
    pdfPrint,
    setPdfPrint
  };

  // pass the value in provider and return
  return <Context.Provider value={mainContext}>{children}</Context.Provider>;
};
