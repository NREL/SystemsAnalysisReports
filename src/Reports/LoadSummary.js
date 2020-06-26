import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { getObjectName, convertDataUnit, getUnitLabel, getHeatingAndCoolingPeakLoads, formatLoadComponentChartData } from '../functions/dataFormatting';
import { formatLoadSummaryTableData } from '../functions/tableFunctions';
import { LoadSummaryPDF } from '../PdfReports/LoadSummaryPDF';
import { useTranslation } from "react-i18next";

export function LoadSummary(props) {
    const { 
        //printRef,
        name,
        activeSelection,
        handleObjectSelect,
        objectList,
        dataMapping,
        data,
        ns
    } = props;
    
    const { 
        sectionSelection, 
        unitSystem, 
        zoneId, setZoneId,
        systemId, setSystemId,
        pdfPrint, setPdfPrint,
        setAnimationEnable,
    } = useContext(Context);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");
    const [ modalShow, setModalShow ] = useState(false);
    const [ progressBarValue, setProgressBarValue ] = useState(0);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const cardRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (pdfPrint) {

            // Async function to write report
            async function writePDFReport() {
                console.log('Print pdf report.');

                // Open progress modal
                setModalShow(true);

                // Get original state
                let setObjectId = null;
                let origId = null;
                if (sectionSelection==='zone_load_summary') {
                    setObjectId = setZoneId;
                    origId = zoneId;
                } else if (sectionSelection==='system_load_summary') {
                    setObjectId = setSystemId;
                    origId = systemId;
                }

                let origHeatingCoolingSelection = heatingCoolingSelection;
                
                // Run function to create report
                await LoadSummaryPDF(
                    unitSystem,
                    sectionSelection,
                    objectList,
                    chart1Ref,
                    chart2Ref,
                    setPdfPrint,
                    setObjectId,
                    setHeatingCoolingSelection,
                    setAnimationEnable,
                    setProgressBarValue,
                    dataMapping,
                    data,
                    ns,
                    t
                    )
                
                // Return to original state
                setModalShow(false);
                setObjectId(origId);
                setHeatingCoolingSelection(origHeatingCoolingSelection);
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
                            <Nav.Link eventKey="cooling">{t("zoneLoadSummary:Cooling")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="heating">{t('zoneLoadSummary:Heating')}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <TableHeader
                                name={name + "-headerTable"}
                                firstColWidth={20}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['headerTable']}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Envelope')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-envelopeTable"}
                                firstColWidth={20}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['envelopeLoadsTable']}
                                data={formatLoadSummaryTableData(dataMapping['envelopeLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Internal Gains')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-internalGainTable"}
                                firstColWidth={20}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['internalGainsTable']}
                                data={formatLoadSummaryTableData(dataMapping['internalGainsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Systems')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-systemLoadsTable"}
                                firstColWidth={20}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['systemLoadsTable']}
                                data={formatLoadSummaryTableData(dataMapping['systemLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Total')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-totalLoadsTable"}
                                firstColWidth={20}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['totalLoadsTable']}
                                data={formatLoadSummaryTableData(dataMapping['totalLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <ReportCard
                                name={name + "-conditionsTimePeak"}
                                title={t("systemLoadSummary:Conditions at Time of Peak")}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['peakConditions']}
                                data={getPeakConditionTable(objectName, heatingCoolingSelection, data)}
                                ns={ns}
                                />
                            </Row>
                            { name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={name + "-temperatures"}
                                    title={t(ns+":Temperatures")}
                                    unitSystem={unitSystem}
                                    dataMapping={dataMapping['temperatures']}
                                    data={getTemperaturesTable(objectName, heatingCoolingSelection, data)}
                                    ns={ns}
                                    />
                                </Row>
                            ) : null }
                            { name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={name + "-airflows"}
                                    title={t(ns+":Airflows")}
                                    unitSystem={unitSystem}
                                    dataMapping={dataMapping['airflows']}
                                    data={getAirflowsTable(objectName, heatingCoolingSelection, data)}
                                    ns={ns}
                                    />
                                </Row>
                            ) : null }
                            <Row>
                                <ReportCard
                                name={name + "-engineeringCheck"}
                                title={t("systemLoadSummary:Engineering Checks")}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['engineeringCheck']}
                                data={getEngineeringCheckTable(objectName, heatingCoolingSelection, data)}
                                ns={ns}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <div>
                            <Row>
                                <CustomPieChart
                                name={name + "-peakLoadsChart"}
                                pdfRef={chart1Ref}
                                title={t(ns+":"+"Peak Loads")+" [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={COOLINGHEATINGCOLORS}
                                data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <CustomPieChart
                                name={name + "-loadComponentsChart"}
                                pdfRef={chart2Ref}
                                title={ t(ns+":"+(heatingCoolingSelection === "cooling" ? "Cooling" : "Heating") + " Load Components") + " [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={EQUIDISTANTCOLORS}
                                data={formatLoadComponentChartData(unitSystem, dataMapping["componentPieChart"], loadData)}
                                ns={ns}
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
                    <Modal.Title>{sectionSelection === "zone_load_summary" ? "Printing Zone Load Summary Report to PDF": "Printing System Load Summary Report to PDF" }</Modal.Title>
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