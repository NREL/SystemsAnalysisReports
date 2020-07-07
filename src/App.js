import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { LoadSummary } from './Reports/LoadSummary';
import { Context } from './store/index';
import { DesignPsychrometrics } from './Reports/DesignPsychrometrics';import './App.css';
import {
  designPsychrometricsMapping,
  zoneLoadSummaryMapping,
  systemLoadSummaryMapping
} from './constants/dataMapping';
import { getLocaleLabel, loadData, formatData } from './functions/dataFormatting';
import { useTranslation } from "react-i18next";

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
            <header className="App-header">
              <p>
                  {t("common:Revit Systems Analysis - Loads Report")}
              </p>
            </header>
            <div className="navigation-container">
                <Container fluid>
                <Row>
                    <Col>
                        <Nav variant="tabs" defaultActiveKey="zone_load_summary" id="report-navbar" onSelect={handleSectionSelection}>
                        <Nav.Item>
                            <Nav.Link eventKey="zone_load_summary">{ t("zoneLoadSummary:Zone Load Summary")}</Nav.Link>
                            {/*<Nav.Link eventKey="zone_load_summary">{ getLocaleLabel(locale, 'zone_load_summary', "Zone Load Summary" )}</Nav.Link>*/}
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="system_load_summary">{ t("systemLoadSummary:System Load Summary")}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="design_psychrometrics">{ t("designPsychrometrics:Design Psychrometrics") }</Nav.Link>
                        </Nav.Item>
                        </Nav>
                    </Col>
                    <Col lg={2}>
                        <div className='App-button-group'>
                            <Dropdown onSelect={handleUnitSystemSelection}>
                                <Dropdown.Toggle id="dropdown-unit-selection"  variant="info">
                                { unitSystem === 'si' ? 'SI' : unitSystem === 'ip' ? 'IP' : 'Revit' }
                                </Dropdown.Toggle>
                
                                <Dropdown.Menu>
                                <Dropdown.Item eventKey="ip">IP</Dropdown.Item>
                                <Dropdown.Item eventKey="si">SI</Dropdown.Item>
                                <Dropdown.Item eventKey="revit">Revit</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown onSelect={handleLocaleSelection}>
                              <Dropdown.Toggle id="dropdown-locale-selection"  variant="light">
                              { getLanguageLabel(i18n.language)  }
                              </Dropdown.Toggle>
              
                              <Dropdown.Menu>
                              <Dropdown.Item eventKey="en">US</Dropdown.Item>
                              <Dropdown.Item eventKey="de">DE</Dropdown.Item>
                              <Dropdown.Item eventKey="es">ES</Dropdown.Item>
                              <Dropdown.Item eventKey="fr">FR</Dropdown.Item>
                              <Dropdown.Item eventKey="it">IT</Dropdown.Item>
                              <Dropdown.Item eventKey="zh">CN</Dropdown.Item>
                              <Dropdown.Item eventKey="cht">TW</Dropdown.Item>
                              <Dropdown.Item eventKey="ja">JP</Dropdown.Item>
                              <Dropdown.Item eventKey="ko">KR</Dropdown.Item>
                              <Dropdown.Item eventKey="ru">RU</Dropdown.Item>
                              <Dropdown.Item eventKey="cs">CZ</Dropdown.Item>
                              <Dropdown.Item eventKey="pl">PL</Dropdown.Item>
                              <Dropdown.Item eventKey="pt">BR</Dropdown.Item>
                              <Dropdown.Item eventKey="eng">GB</Dropdown.Item>

                              </Dropdown.Menu>
                            </Dropdown> 
                            <Button onClick={handlePrintClick} disabled={pdfPrint}>
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
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                      { renderActiveSection(sectionSelection, data) }
                    </Col>
                </Row>
                </Container>
            </div>
          </div>
        );
    }
}