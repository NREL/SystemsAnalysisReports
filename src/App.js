import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
//import html2canvas from 'html2canvas';
//import jsPDF from 'jspdf';
import { LoadSummary } from './Reports/LoadSummary';
import { Context } from './store/index';
import { DesignPsychrometrics } from './Reports/DesignPsychrometrics';import './App.css';
import {
  designPsychrometricsMapping,
  zoneLoadSummaryMapping,
  systemLoadSummaryMapping
} from './constants/dataMapping';
import { getLocaleLabel, loadData, formatData } from './functions/dataFormatting';

export default function App(props) {
    const { 
        sectionSelection, setSectionSelection, 
        unitSystem, setUnitSystem,
        locale, setLocale,
        zoneId, setZoneId,
        pdfPrint, setPdfPrint,
    } = useContext(Context);
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState(null);
    const [ systemId, setSystemId ] = useState(0);
    const [ coilId, setCoilId ] = useState(0);
    const { json } = props;

    useEffect(() => {
        console.log('hi');
        fetchData();
      }, [json]);
    
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
            setLocale(value);
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
                Revit Systems Analysis - Loads Report
              </p>
            </header>
            <div className="navigation-container">
                <Container fluid>
                <Row>
                    <Col>
                        <Nav variant="tabs" defaultActiveKey="zone_load_summary" id="report-navbar" onSelect={handleSectionSelection}>
                        <Nav.Item>
                            <Nav.Link eventKey="zone_load_summary">{ getLocaleLabel(locale, 'zone_load_summary' )}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="system_load_summary">System Load Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="design_psychrometrics">Design Psychrometrics</Nav.Link>
                        </Nav.Item>
                        </Nav>
                    </Col>
                    <Col lg={2}>
                        <div className='App-button-group'>
                            <Dropdown onSelect={handleUnitSystemSelection}>
                                <Dropdown.Toggle id="dropdown-unit-selection"  variant="info">
                                { unitSystem === 'si' ? 'SI' : 'IP'  }
                                </Dropdown.Toggle>
                
                                <Dropdown.Menu>
                                <Dropdown.Item eventKey="ip">IP</Dropdown.Item>
                                <Dropdown.Item eventKey="si">SI</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown onSelect={handleLocaleSelection}>
                              <Dropdown.Toggle id="dropdown-locale-selection"  variant="light">
                              { locale === 'en' ? 'EN' : 'DE'  }
                              </Dropdown.Toggle>
              
                              <Dropdown.Menu>
                              <Dropdown.Item eventKey="en">EN</Dropdown.Item>
                              <Dropdown.Item eventKey="de">DE</Dropdown.Item>
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