import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { LoadSummary } from './Reports/LoadSummary';
import { Context } from './store/index';
import { DesignPsychrometrics } from './Reports/DesignPsychrometrics';import './App.css';
import {
  designPsychrometricsMapping,
  zoneLoadSummaryMapping,
  systemLoadSummaryMapping
} from './constants/dataMapping';
import { loadData, formatData } from './functions/dataFormatting';

export default function App(props) {
    const { 
        sectionSelection, setSectionSelection, 
        unitSystem, setUnitSystem, 
        zoneId, setZoneId 
    } = useContext(Context);
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState(null);
    const [ systemId, setSystemId ] = useState(0);
    const [ coilId, setCoilId ] = useState(0);
    const { json } = props;

    useEffect(() => {
        // Function to load data asyncronously
        loadData(json).then(rawData => {
            formatData(rawData).then(formatData => {
                if (formatData) {
                    setData(formatData);
                    setLoading(false);
                };
            })
        })
      }, [json]);

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
    
    const renderActiveSection = (value, data) => {
        if (value === 'zone_load_summary') {
            return(
            <LoadSummary
            key="zoneLoadSummary"
            name="zoneLoadSummary"
            activeSelection={zoneId}
            handleObjectSelect={handleZoneSelection}
            unitSystem={unitSystem}
            dataMapping={zoneLoadSummaryMapping}
            data={data['zone_load_summarys']}
            />
        
            )
        } else if (value === 'system_load_summarys') {
            return(
            <LoadSummary
            key="systemLoadSummary"
            name="systemLoadSummary"
            activeSelection={systemId}
            handleObjectSelect={handleSystemSelection}
            unitSystem={unitSystem}
            dataMapping={systemLoadSummaryMapping}
            data={data['system_load_summarys']}
            />
            )
        } else if (value === 'design_psychrometrics') {
            return(
            <DesignPsychrometrics
            key="designPsychrometrics"
            name="designPsychrometrics"
            objectSelection={coilId}
            handleObjectSelect={handleCoilSelection}
            unitSystem={unitSystem}
            dataMapping={designPsychrometricsMapping}
            data={data['design_psychrometrics']}
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
          <div className="App">
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
                            <Nav.Link eventKey="zone_load_summary">Zone Load Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="system_load_summarys">System Load Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="design_psychrometrics">Design Psychrometrics</Nav.Link>
                        </Nav.Item>
                        </Nav>
                    </Col>
                    <Col lg={1}>
                        <Dropdown onSelect={handleUnitSystemSelection}>
                            <Dropdown.Toggle id="dropdown-unit-selection"  variant="info">
                            { unitSystem === 'si' ? 'SI' : 'IP'  }
                            </Dropdown.Toggle>
            
                            <Dropdown.Menu>
                            <Dropdown.Item eventKey="ip">IP</Dropdown.Item>
                            <Dropdown.Item eventKey="si">SI</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> 
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