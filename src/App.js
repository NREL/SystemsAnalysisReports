import React, { useContext, useEffect, useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    const [ zonesObjectList, setZonesObjectList ] = useState([]);
    const appRef = useRef(null);
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
      });//, [json]);

    useEffect(() => {
        if(data) {
            setZonesObjectList(getObjectList(data['zone_load_summarys']));
        }
    }, [data]);

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

    const handlePrintClick = async () => {
        if (appRef) {
            console.log('PDF being created...');
            const pdf = new jsPDF({orientation: 'portrait'});

            console.log(zonesObjectList.length);
            for (var i = 0; i < 4; i++) {
            //for (var i = 0; i < zonesObjectList.length; i++) {
                setZoneId(i);
                if (i>0) { pdf.addPage() }
                await html2canvas(appRef.current, {
                    //scale: 0.5,
                    }).then(canvas => {
                        var imgData = canvas.toDataURL('image/png');
                        var imgProps= pdf.getImageProperties(imgData);
                        var pdfWidth = pdf.internal.pageSize.getWidth();
                        var pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    })
            }

            //pdf.output('dataurlnewwindow');
            pdf.save('download.pdf');
        } else {
            console.log('No PDF')
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
            return(
            <LoadSummary
            id="zoneLoadSummary"
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
            id="systemLoadSummary"
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
            id="designPsychrometrics"
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
        //const zonesObjectList = getObjectList(data['zone_load_summarys']);
        const systemsObjectList = getObjectList(data['system_load_summarys']);
        const coilsObjectList = getObjectList(data['design_psychrometrics']);

        //console.log(appRef);

        return(
          <div className="App" id="app" ref={appRef}>
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
                            <Button onClick={handlePrintClick}>PDF</Button>
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