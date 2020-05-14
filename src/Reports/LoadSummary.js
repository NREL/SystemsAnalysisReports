import React, { useContext, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
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
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';

export function LoadSummary(props) {
    const { 
        name,
        activeSelection,
        handleObjectSelect,
        dataMapping,
        data
    } = props;
    
    const { 
        sectionSelection, 
        unitSystem, 
        zoneId, setZoneId 
    } = useContext(Context);
    const [ dataExists, setDataExists ] = useState(false);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");
    const [ objectSelection, setObjectSelection ] = useState(0);

    useEffect(() => {
        // Set data_exists state to false if data object is empty
        if (data && Object.keys(data).length === 0) {
            setDataExists(false);
        } else {
            setDataExists(true);
        }
    }, [data]);

    const handleHeatingCoolingSelect = (eventKey) => {
        // Update state when user selects either "heating" or "cooling"
        if (eventKey === "heating") {
            setHeatingCoolingSelection("heating");
        } else {
            setHeatingCoolingSelection("cooling");          
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

    const getObjectName = (objectList, id) => {
        // Get the string name of the object given an id
        if ( isNumeric(id) && objectList && objectList.length > 0 ) {
            for (var i = 0; i < objectList.length; i++) {
                if (
                    Object.keys(objectList[i]).includes("id") && 
                    objectList[i].id.toString() === id.toString()
                    ) {
                    return objectList[i].name
                }
            }
        } else return null
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

    const objectList = getObjectList(data);
    const objectName = getObjectName(objectList,activeSelection);
    const loadData = getLoadComponents(objectName, heatingCoolingSelection, data);

    return (
        ( dataExists ?
            <Tab.Container id={name + '-container'} activeKey={heatingCoolingSelection} defaultActiveKey="cooling">
                <Row>
                    {getObjectList(data) ? <ObjectSelectionDropDown
                    name={name + "-objectDropdown"}
                    objectList={getObjectList(data)}
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
                        <Row>
                            <CustomPieChart
                            name={name + "-peakLoadsChart"}
                            title={"Peak Loads Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                            colors={COOLINGHEATINGCOLORS}
                            data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                            />
                        </Row>
                        <Row>
                            <CustomPieChart
                            name={name + "-loadComponentsChart"}
                            title={ (heatingCoolingSelection === "cooling" ? "Cooling" : "Heating") + " Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                            colors={EQUIDISTANTCOLORS}
                            data={formatLoadComponentChartData(unitSystem, dataMapping["componentPieChart"], loadData)}
                            /> 
                        </Row>
                    </Col>
            </Row>
            </Tab.Container> 
        : 
            <h1>No {name === "zoneLoadSummary" ? "zones": "systems" } found.</h1> 
        )
    );
}