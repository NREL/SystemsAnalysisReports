import React, { useContext, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import loadable from '@loadable/component';
//import Tabs, { Tab } from "@hig/tabs";
import { Tab } from './Components/Tab';
import { CustomSelect } from './Components/CustomSelect';
import { Context } from './store/index';
import './App.css';
import {
  designPsychrometricsMapping,
  zoneLoadSummaryMapping,
  systemLoadSummaryMapping
} from './constants/dataMapping';
import { getLocaleLabel, loadData, formatData } from './functions/dataFormatting';
import { useTranslation } from "react-i18next";
import zone_default_icon from "../public/icons/zone_defalut.png";


const LoadSummary = loadable(() => import("./Reports/LoadSummary.js"), {
    fallback: <p>Loading</p>
  });

const DesignPsychrometrics = loadable(() => import("./Reports/DesignPsychrometrics.js"), {
    fallback: <p>Loading</p>
});

export default function App(props) {
    const { 
        sectionSelection, setSectionSelection, 
        unitSystem, setUnitSystem,
        // locale, setLocale,
        zoneId, setZoneId,
        systemId, setSystemId,
        coilId, setCoilId,
        pdfPrint, setPdfPrint,
    } = useContext(Context);
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState(null);
    const { json } = props;
    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetchData();
      }, [json]
    );
    
    const fetchData = async () => {
        // Function to load data asyncronously
        loadData(json).then(rawData => {
            formatData(rawData).then(formatData => {
                if (formatData) {
                    setData(formatData);
                    setLoading(false);
                };
            })
        })
    } 

    const handleSectionSelection = (value) => {
        if (value) {
            setSectionSelection(value); 
        }
    }

    const handleUnitSystemSelection = (value) => {
        if (value) {
            setUnitSystem(value);
        }
    }

    const handleLocaleSelection = (value) => {
        if (value) {
            // setLocale(value);
            // console.log(value)
            i18n.changeLanguage(value)
        }
    }

    const handlePrintClick = () => {
        setPdfPrint(true);
    } 

    const handleZoneSelection = (event) => {
        if (event) {
            setZoneId(event);
        }
    }

    const handleSystemSelection = (value) => {
        if (value) {
            setSystemId(value); 
        }
    }

    const handleCoilSelection = (value) => {
        if (value) {
            setCoilId(value);
        }
    }

    const getLanguageLabel = (value) => {
        let language_displays = {
            "en": "US",
            "de": "DE",
            "es": "ES",
            "fr": "FR",
            "it": "IT",
            "zh": "CN",
            "cht": "TW",
            "ja": "JP",
            "ko": "KR",
            "ru": "RU",
            "cs": "CZ",
            "pl": "PL",
            "pt": "BR",
            "eng": "GB"
        }

        return language_displays[value]
    }
    
    const unitSelectionOptions = [
        { value: 'revit', label: 'Revit' },
        { value: 'ip', label: 'IP' },
        { value: 'si', label: 'SI' }
      ]

    const languageSelectionOptions = [
        { value:'en', label: 'US'},
        { value:'de', label: 'DE'},
        { value:'es', label: 'ES'},
        { value:'fr', label: 'FR'},
        { value:'it', label: 'IT'},
        { value:'zh', label: 'CH'},
        { value:'cht', label: 'TW'},
        { value:'ja', label: 'JP'},
        { value:'ko', label: 'KR'},
        { value:'ru', label: 'RU'},
        { value:'cs', label: 'CZ'},
        { value:'pl', label: 'PL'},
        { value:'pt', label: 'BR'},
        { value:'eng', label: 'GB'},
    ]

    const getObjectList = (data) => {
        // Get a list of object names, ids, and cad_object, ids
        var object_list = [];

        if (data) {
            const objList = Object.keys(data);
            for (var i = 0; i < objList.length; i++) {
                const objName = objList[i];
                object_list.push({id: i, cad_object_id: data[objName].cad_object_id, name: data[objName].name});
            }
        }

        return object_list
    }

    const renderActiveSection = (value, data) => {

        if (value === 'zone_load_summary') {
            const activeData = data['zone_load_summarys'];
            const objectList = getObjectList(activeData);

            return(
            <LoadSummary
            id="zoneLoadSummary"
            key="zoneLoadSummary"
            name="zoneLoadSummary"
            activeSelection={zoneId}
            handleObjectSelect={handleZoneSelection}
            objectList={objectList}
            unitSystem={unitSystem}
            dataMapping={zoneLoadSummaryMapping}
            data={activeData}
            ns={"zoneLoadSummary"}
            />
        
            )
        } else if (value === 'system_load_summary') {
            const activeData = data['system_load_summarys'];
            const objectList = getObjectList(activeData);

            return(
            <LoadSummary
            id="systemLoadSummary"
            key="systemLoadSummary"
            name="systemLoadSummary"
            activeSelection={systemId}
            handleObjectSelect={handleSystemSelection}
            objectList={objectList}
            unitSystem={unitSystem}
            dataMapping={systemLoadSummaryMapping}
            data={activeData}
            ns={"systemLoadSummary"}
            />
            )
        } else if (value === 'design_psychrometrics') {
            const activeData = data['design_psychrometrics'];
            const objectList = getObjectList(activeData);

            return(
            <DesignPsychrometrics
            id="designPsychrometrics"
            key="designPsychrometrics"
            name="designPsychrometrics"
            objectSelection={coilId}
            handleObjectSelect={handleCoilSelection}
            objectList={objectList}
            unitSystem={unitSystem}
            dataMapping={designPsychrometricsMapping}
            data={activeData}
            ns={"designPsychrometrics"}
            />
            )
        } else {
            return(
            <div>
                No Section Selected
            </div>
            )
        }
    }

    const tabList = ["zone_load_summary", "system_load_summary", "design_psychrometrics"];

    if( loading ) { // if your component doesn't have to wait for an async action, remove this block 
        return(
            <div className="navigation-container">
                <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        )
    } else {
        return(
          <div className="App" id="app">
            <div className="App-navigation">
                <div className="navigation-group-left" style={{float: "left"}}>
                    <Tab icon={zone_default_icon} label="zoneLoadSummary:Zone Load Summary"/>
                </div>
                <div className="navigation-group-right">
                    <CustomSelect
                        id="dropdown-unit-selection"
                        className="right-header-select"
                        options={unitSelectionOptions}
                        defaultValue={{ value: 'revit', label: 'Revit' }}
                        onChange={(e) => handleUnitSystemSelection(e.value)}
                        width="250px"
                    >
                    </CustomSelect>
                    <CustomSelect
                        id="dropdown-locale-selection"
                        className="right-header-select"
                        options={languageSelectionOptions}
                        defaultValue={{ value:'en', label: 'US'}}
                        onChange={(e) => handleLocaleSelection(e.value)}
                        width="250px"
                    >
                    </CustomSelect>
                    <button className="button" onClick={handlePrintClick} disabled={pdfPrint}>
                        { pdfPrint ? 
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : 
                            <span>PDF</span>
                        }
                    </button>
                </div>
            </div>
            { renderActiveSection(sectionSelection, data) }
          </div>
        );
    }
}