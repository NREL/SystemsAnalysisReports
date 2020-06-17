import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { getLoadSummaryPDF } from './getLoadSummaryPDF';
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
        pdfPrint, setPdfPrint,
    } = useContext(Context);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");
    const tableRef = useRef(null);
    const chartRef = useRef(null);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const cardRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (pdfPrint && sectionSelection==='zone_load_summary') {
            console.log('pdf print.');
            getLoadSummaryPDF(objectList, chartRef, chart1Ref, chart2Ref, cardRef, setPdfPrint, setZoneId, dataMapping, data)
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

    const getHeatingAndCoolingPeakLoads = (unitSystem, objectName, data) => {
        // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
        // Investigate further whether this should be a calculated value from the subcomponents.
        
        if (data) {
            if (objectName) {
                const objectData = data[objectName]

                if (objectData) {
                    // get load and convert unit system
                    const peakCoolingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', objectData['cooling']['estimated_peak_load_component_table']['grand_total']['total']);
                    const peakHeatingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', objectData['heating']['estimated_peak_load_component_table']['grand_total']['total']);

                    const output = [ 
                        {'name': 'Cooling', 'value': parseInt(Math.abs(peakCoolingLoad))},
                        {'name': 'Heating', 'value': parseInt(Math.abs(peakHeatingLoad))}
                    ]

                    return output
                } else {
                    return null
                }
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

    const formatLoadComponentChartData = (unitSystem, dataMapping, data) => {

        if (data) {
        // This function formats the data that will be displayed in a chart.
        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(dataMapping).map((group) => {
            var total = 0;
            // Loop again to total the loads for each load group
            dataMapping[group].map((loadComponent) => ( Object.keys(data).includes(loadComponent) ? total += Math.abs(data[loadComponent]['total']) : null ))

            // Convert unit system and add value to array
            newData.push({'name': group, 'value': parseInt(convertDataUnit(unitSystem, 'heat_transfer_rate', total))})
            return newData
        })

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
                            <Nav.Link eventKey="cooling">{t("zoneLoadSummary:Cooling")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="heating">{t('zoneLoadSummary:Heating')}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    <Row>
                        <Col md={6} ref={tableRef}>
                            <Row>
                                <TableHeader
                                name={name + "-headerTable"}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['headerTable']}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Envelope')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-envelopeTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['envelopeLoadsTable']}
                                data={formatTableData(dataMapping['envelopeLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Internal Gains')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-internalGainTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['internalGainsTable']}
                                data={formatTableData(dataMapping['internalGainsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Systems')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-systemLoadsTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['systemLoadsTable']}
                                data={formatTableData(dataMapping['systemLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <span>{t('zoneLoadSummary:Total')}</span>
                                <CustomTable
                                t={t}
                                name={name + "-totalLoadsTable"}
                                displayHeader={false}
                                unitSystem={unitSystem}
                                dataMapping={dataMapping['totalLoadsTable']}
                                data={formatTableData(dataMapping['totalLoadsTable'], loadData)}
                                ns={ns}
                                />
                            </Row>
                        </Col>
                        <Col ref={cardRef}>
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
                            <div ref={chartRef}>
                            <Row>
                                <CustomPieChart
                                pdfRef={chart1Ref}
                                name={name + "-peakLoadsChart"}
                                title={t(ns+":"+"Peak Loads")+" [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={COOLINGHEATINGCOLORS}
                                data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                                ns={ns}
                                />
                            </Row>
                            <Row>
                                <CustomPieChart
                                pdfRef={chart2Ref}
                                name={name + "-loadComponentsChart"}
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
                </div>
        );
    } else {
        return( <h1>No {name === "zoneLoadSummary" ? "zones": "systems" } found.</h1> )
    }
}