import React, { useState, createContext } from 'react';
import config from './config.json'
import './i18n'
import {getI18n} from "react-i18next";

// Uses React Hooks Context API to provide a global store for state
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

export const Context = createContext();

export const Provider = ({ children }) => {
  // Provide global state hooks
  const [ sectionSelection, setSectionSelection ] = useState('zone_load_summary');
  const [ unitSystem, setUnitSystem ] = useState('revit');
  const [ zoneId, setZoneId ] = useState(0);
  const [ pdfPrint, setPdfPrint ] = useState(false);
  getI18n().changeLanguage(language_map[config['language']]);

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

