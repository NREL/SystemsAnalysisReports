import React, { useState, createContext } from 'react';
import config from './config.json'
import './i18n'
import {getI18n} from "react-i18next";

const language_map = {
  "en-US": "en",
  "de-DE": "de",
  "es-ES": "es",
  "fr-FR": "fr",
  "it-IT": "it",
  "nl-NL": "nl",
  "zh-CN": "zh",
  "zh-TW": "cht",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "ru-RU": "ru",
  "cs-CZ": "cs",
  "pl-PL": "pl",
  "hu-HU": "hu",
  "pt-BR": "pt",
  "en-GB": "eng",
}

getI18n().changeLanguage(language_map[config['language']]);

// Uses React Hooks Context API to provide a global store for state
export const Context = createContext();

export const Provider = ({ children }) => {
  // Provide global state hooks
  const [ sectionSelection, setSectionSelection ] = useState('zone_load_summary');
  const [ unitSystem, setUnitSystem ] = useState('revit');
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

