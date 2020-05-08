import React from 'react';
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { ReportCard } from '../Components/ReportCard';
import { CustomTable } from '../Components/Table';
import TableHeader from '../Components/TableHeader';
import { CustomPieChart } from '../Components/PieChart';
import { 
    EQUIDISTANTCOLORS,
    COOLINGHEATINGCOLORS
} from '../constants/settings';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';

export class LoadSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_exists: false,
            heating_cooling_selection: "cooling",
            engineering_check_table: "engineering_check",
            peak_condition_table: "peak_condition",
            peak_load_component_table: "estimated_peak_load_component_table",
            object_selection: 0,
        };
    }

    componentDidMount() {
        // Set data_exists state to false if data object is empty
        if (this.props.data && Object.keys(this.props.data).length === 0) {
            this.setState({ data_exists: false })
        } else {
            this.setState({ data_exists: true })
        }
    }

    handleObjectSelect(eventKey) {
        // Update state when user selects a object from dropdown
        this.setState({
            object_selection: eventKey,
        });
    }

    handleHeatingCoolingSelect(eventKey) {
        // Update state when user selects either "heating" or "cooling"
        if (eventKey === "heating") {
            this.setState({
                heating_cooling_selection: "heating",
            });
        } else {
            this.setState({
                heating_cooling_selection: "cooling",
            });           
        }
    }

    getObjectList() {
        // Get a list of object names, ids, and cad_object, ids
        var object_list = [];

        if (this.props.data) {
            const objList = Object.keys(this.props.data);
            for (var i = 0; i < objList.length; i++) {
                const objName = objList[i];
                object_list.push({id: i, cad_object_id: this.props.data[objName].cad_object_id, name: this.props.data[objName].name});
            }
        }

        return object_list
    }

    getObjectName(id) {
        // Get the string name of the object given an id
        const objectList = this.getObjectList();
        for (var i = 0; i < objectList.length; i++) {
            if (objectList[i].id.toString() === id.toString()) {
                return objectList[i].name
            }
        }

        // if none exists reset the index to 0
        //this.handleObjectSelect(0);
    }

    getLoadComponents() {
        // Get data for peak_load_component_table
        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                return this.props.data[objectName][this.state.heating_cooling_selection]['estimated_peak_load_component_table']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    getPeakConditionTable() {
        // Get data for peak_condition_table
        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                return this.props.data[objectName][this.state.heating_cooling_selection]['peak_condition']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    getTemperaturesTable() {
        // Get data for peak_condition_table
        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                return this.props.data[objectName][this.state.heating_cooling_selection]['temperature']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    getAirflowsTable() {
        // Get data for peak_condition_table
        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                return this.props.data[objectName][this.state.heating_cooling_selection]['airflow']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    getEngineeringCheckTable() {
        // Get data for engineering_check_table
        if (this.props.data && Object.keys(this.props.data).length !== 0) {  
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                return this.props.data[objectName][this.state.heating_cooling_selection]['engineering_check']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    getHeatingAndCoolingPeakLoads(unitSystem) {
        // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
        // Investigate further whether this should be a calculated value from the subcomponents.
        
        if (this.props.data) {
            const objectName = this.getObjectName(this.state.object_selection);
            if (objectName) {
                const data = this.props.data[objectName]

                if (data) {
                    // get load and convert unit system
                    const peakCoolingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', data['cooling']['estimated_peak_load_component_table']['grand_total']['total']);
                    const peakHeatingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', data['heating']['estimated_peak_load_component_table']['grand_total']['total']);

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

    formatTableData(dataMapping, data) {
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

    formatLoadComponentChartData(unitSystem, dataMapping, data) {

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

    render() {
        const { unitSystem } = this.props;
        const loadData = this.getLoadComponents();

        return (
            ( this.state.data_exists ?
                <Tab.Container id={this.props.name + '-container'} activeKey={this.state.heating_cooling_selection} defaultActiveKey="cooling">
                    <Row>
                        {this.getObjectList() ? <ObjectSelectionDropDown
                        name={this.props.name + "-objectDropdown"}
                        objectList={this.getObjectList()}
                        objectSelection={this.state.object_selection}
                        handleObjectSelect={this.handleObjectSelect.bind(this)}
                        /> : null}

                        <Nav variant="pills" onSelect={this.handleHeatingCoolingSelect.bind(this)} className="App-buttons">
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
                                name={this.props.name + "-headerTable"}
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['headerTable']}
                                />
                            </Row>
                            <Row>
                                <span>Envelope</span>
                                <CustomTable
                                name={this.props.name + "-envelopeTable"}
                                displayHeader={false}
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['envelopeLoadsTable']}
                                data={this.formatTableData(this.props.dataMapping['envelopeLoadsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Internal Gains</span>
                                <CustomTable
                                name={this.props.name + "-internalGainTable"}
                                displayHeader={false}
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['internalGainsTable']}
                                data={this.formatTableData(this.props.dataMapping['internalGainsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Systems</span>
                                <CustomTable
                                name={this.props.name + "-systemLoadsTable"}
                                displayHeader={false}
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['systemLoadsTable']}
                                data={this.formatTableData(this.props.dataMapping['systemLoadsTable'], loadData)}
                                />
                            </Row>
                            <Row>
                                <span>Total</span>
                                <CustomTable
                                name={this.props.name + "-totalLoadsTable"}
                                displayHeader={false}
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['totalLoadsTable']}
                                data={this.formatTableData(this.props.dataMapping['totalLoadsTable'], loadData)}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <ReportCard
                                name={this.props.name + "-conditionsTimePeak"}
                                title="Conditions at Time of Peak"
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['peakConditions']}
                                data={this.getPeakConditionTable()}
                                />
                            </Row>
                            { this.props.name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={this.props.name + "-temperatures"}
                                    title="Temperatures"
                                    unitSystem={this.props.unitSystem}
                                    dataMapping={this.props.dataMapping['temperatures']}
                                    data={this.getTemperaturesTable()}
                                    />
                                </Row>
                            ) : null }
                            { this.props.name === 'systemLoadSummary' ? (
                                <Row>
                                    <ReportCard
                                    name={this.props.name + "-airflows"}
                                    title="Airflows"
                                    unitSystem={this.props.unitSystem}
                                    dataMapping={this.props.dataMapping['airflows']}
                                    data={this.getAirflowsTable()}
                                    />
                                </Row>
                            ) : null }
                            <Row>
                                <ReportCard
                                name={this.props.name + "-engineeringCheck"}
                                title="Engineering Checks"
                                unitSystem={this.props.unitSystem}
                                dataMapping={this.props.dataMapping['engineeringCheck']}
                                data={this.getEngineeringCheckTable()}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <CustomPieChart
                                name={this.props.name + "-peakLoadsChart"}
                                title={"Peak Loads Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={COOLINGHEATINGCOLORS}
                                data={this.getHeatingAndCoolingPeakLoads(unitSystem)}
                                />
                            </Row>
                            <Row>
                                <CustomPieChart
                                name={this.props.name + "-loadComponentsChart"}
                                title={ (this.state.heating_cooling_selection === "cooling" ? "Cooling" : "Heating") + " Load Components [" + getUnitLabel(unitSystem, "heat_transfer_rate") + "]"}
                                colors={EQUIDISTANTCOLORS}
                                data={this.formatLoadComponentChartData(unitSystem, this.props.dataMapping["componentPieChart"], loadData)}
                                /> 
                            </Row>
                        </Col>
                </Row>
                </Tab.Container> 
            : 
                <h1>No {this.props.name === "zoneLoadSummary" ? "zones": "systems" } found.</h1> 
            )
        );
    }
}