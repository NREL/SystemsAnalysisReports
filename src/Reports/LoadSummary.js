import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { ReportCard } from '../Components/ReportCard';
import { CustomTable } from '../Components/Table';
import TableHeader from '../Components/TableHeader';
import { CustomPieChart } from '../Components/PieChart';
import { Context } from '../store/index';
import { 
    EQUIDISTANTCOLORS,
    COOLINGHEATINGCOLORS
} from '../constants/settings';
import { isNumeric } from '../functions/numericFunctions';
import { getObjectName, convertDataUnit, getUnitLabel, getHeatingAndCoolingPeakLoads, formatLoadComponentChartData } from '../functions/dataFormatting';
import { LoadSummaryPDF } from '../PdfReports/LoadSummaryPDF';

export function LoadSummary(props) {
    const { 
        //printRef,
        name,
        activeSelection,
        handleObjectSelect,
        objectList,
        dataMapping,
        data
    } = props;
    
    const { 
        sectionSelection, 
        unitSystem, 
        zoneId, setZoneId,
        pdfPrint, setPdfPrint,
        setAnimationEnable,
    } = useContext(Context);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");
    const [ modalShow, setModalShow ] = useState(false);
    const [ progressBarValue, setProgressBarValue ] = useState(0);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);

    useEffect(() => {
        if (pdfPrint && sectionSelection==='zone_load_summary') {
            // Write report
            async function writePDFReport() {
                console.log('Print pdf report.');
                setModalShow(true);
                await LoadSummaryPDF(objectList, chart1Ref, chart2Ref, setPdfPrint, setZoneId, setHeatingCoolingSelection, setAnimationEnable, setProgressBarValue, dataMapping, data)
                setModalShow(false);
            }
            
            writePDFReport()
        }
    }, [pdfPrint, sectionSelection]);

    const handleHeatingCoolingSelect = (eventKey) => {
        // Update state when user selects either "heating" or "cooling"
        if (eventKey === "heating") {
            setHeatingCoolingSelection("heating");
        } else {
            setHeatingCoolingSelection("cooling");          
        }
    }

    const getLoadComponents = (objectName, heatingCoolingSelection, data) => {
        // Get data for peak_load_component_table
        if (data && Object.keys(data).length !== 0) {
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['estimated_peak_load_component_table']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    const getPeakConditionTable = (objectName, heatingCoolingSelection, data) => {
        // Get data for peak_condition_table
        if (data && Object.keys(data).length !== 0) {
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['peak_condition']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    const getTemperaturesTable = (objectName, heatingCoolingSelection, data) => {
        // Get data for peak_condition_table
        if (data && Object.keys(data).length !== 0) {
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['temperature']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    const getAirflowsTable = (objectName, heatingCoolingSelection, data) => {
        // Get data for peak_condition_table
        if (data && Object.keys(data).length !== 0) {
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['airflow']
            } else { 
                return null
            }
        } else {
            return null
        }
    }

    const getEngineeringCheckTable = (objectName, heatingCoolingSelection, data) => {
        // Get data for engineering_check_table
        if (data && Object.keys(data).length !== 0) {  
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['engineering_check']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    const formatTableData = (dataMapping, data) => {
        // This function formats the data that will be displayed in the table.
        if (data) {
            var newData = JSON.parse(JSON.stringify(data));
            var totals = {
                "latent": 0.0,
                "sensible_delayed": 0.0,
                "sensible_instant": 0.0,
                "total": 0.0,
                "percent_grand_total": 0.0
            };

            // Loop and calculate the table subtotals for each column
            if (newData) {
                dataMapping['rows'].map((row) => {
                    Object.keys(totals 
                        ).map((colName) => {
                        var rowName = row['jsonKey'];
                        if (Object.keys(newData).includes(rowName) && rowName !== "total" && newData[rowName]) {
                            totals[colName] += newData[rowName][colName]
                        }
                        return totals
                    })
                    return totals
                });

                // Add total row to the data object
                newData["subtotal"] = totals;
            }

            return newData
        } else {
            return null
        }
    }

    if (data && Object.keys(data).length !== 0) {
        const objectName = getObjectName(objectList,activeSelection);
        const loadData = getLoadComponents(objectName, heatingCoolingSelection, data);

        return (
                <div id={name + '-loadsummaryreport'}  height="500px" width="50px">
                <Tab.Container id={name + '-container'} activeKey={heatingCoolingSelection} defaultActiveKey="cooling">
                    <Row>
                        {objectList ? <ObjectSelectionDropDown
                        name={name + "-objectDropdown"}
                        objectList={objectList}
                        objectSelection={activeSelection}
                        handleObjectSelect={handleObjectSelect}
                        /> : null}

                        <Nav variant="pills" onSelect={handleHeatingCoolingSelect} className="App-buttons">
                            <Nav.Item>
                            <Nav.Link eventKey="cooling">Cooling</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="heating">Heating</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <TableHeader
                                name={name + "-headerTable"}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['headerTable']}
                                />
                            </Row>
                            <Row>
                                <span>Envelope</span>
                                <CustomTable
                                name={name + "-envelopeTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['envelopeLoadsTable']}
                                data={formatTableData(dataMapping['envelopeLoadsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Internal Gains</span>
                                <CustomTable
                                name={name + "-internalGainTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['internalGainsTable']}
                                data={formatTableData(dataMapping['internalGainsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Systems</span>
                                <CustomTable
                                name={name + "-systemLoadsTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['systemLoadsTable']}
                                data={formatTableData(dataMapping['systemLoadsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Total</span>
                                <CustomTable
                                name={name + "-totalLoadsTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['totalLoadsTable']}
                                data={formatTableData(dataMapping['totalLoadsTable'], loadData)}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <ReportCard
                                name={name + "-conditionsTimePeak"}
                                title="Conditions at Time of Peak"
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['peakConditions']}
                                data={getPeakConditionTable(objectName, heatingCoolingSelection, data)}
                                />
                            </Row>
                            { name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={name + "-temperatures"}
                                    title="Temperatures"
                                    unitSystem={unitSystem}
                                    dataMapping={dataMapping['temperatures']}
                                    data={getTemperaturesTable(objectName, heatingCoolingSelection, data)}
                                    />
                                </Row>
                            ) : null }
                            { name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={name + "-airflows"}
                                    title="Airflows"
                                    unitSystem={unitSystem}
                                    dataMapping={dataMapping['airflows']}
                                    data={getAirflowsTable(objectName, heatingCoolingSelection, data)}
                                    />
                                </Row>
                            ) : null }
                            <Row>
                                <ReportCard
                                name={name + "-engineeringCheck"}
                                title="Engineering Checks"
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['engineeringCheck']}
                                data={getEngineeringCheckTable(objectName, heatingCoolingSelection, data)}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <div>
                            <Row>
                                <CustomPieChart
                                name={name + "-peakLoadsChart"}
                                pdfRef={chart1Ref}
                                title={"Peak Loads Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={COOLINGHEATINGCOLORS}
                                data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                                />
                            </Row>
                            <Row>
                                <CustomPieChart
                                name={name + "-loadComponentsChart"}
                                pdfRef={chart2Ref}
                                title={ (heatingCoolingSelection === "cooling" ? "Cooling" : "Heating") + " Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={EQUIDISTANTCOLORS}
                                data={formatLoadComponentChartData(unitSystem, dataMapping["componentPieChart"], loadData)}
                                />
                            </Row>
                            </div>
                        </Col>
                    </Row>
                </Tab.Container>
                <Modal
                    show={modalShow}
                    onHide={(() => setModalShow(false))}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton={false}>
                    <Modal.Title>Printing pdf report.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <ProgressBar now={progressBarValue} />
                    </Modal.Body>
                </Modal>
                </div>
        );
    } else {
        return( <h1>No {name === "zoneLoadSummary" ? "zones": "systems" } found.</h1> )
    }
}