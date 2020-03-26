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

export class LoadSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heating_cooling_selection: "cooling",
            engineering_check_table: "cooling_engineering_check_table",
            peak_condition_table: "cooling_peak_condition_table",
            peak_load_component_table: "cooling_peak_load_component_table",
            object_selection: null,
        };
    } 

    componentDidMount() {
        const objectList = this.getObjectList()
        this.handleObjectSelect(objectList[0]);
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
                engineering_check_table: "heating_engineering_check_table",
                peak_condition_table: "heating_peak_condition_table",
                peak_load_component_table: "heating_peak_load_component_table"
            });
        } else {
            this.setState({
                heating_cooling_selection: "cooling",
                engineering_check_table: "cooling_engineering_check_table",
                peak_condition_table: "cooling_peak_condition_table",
                peak_load_component_table: "cooling_peak_load_component_table"
            });           
        }
    }

    getObjectList() {
        // Get a list of object names, ids, and cad_object, ids
        var object_list = []

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
        for (var i = 0; i < this.state.object_list.length; i++) {
            if (this.state.object_list[i].id.toString() === id.toString()) {
                return this.state.object_list[i].name
            }
        }
    }

    getLoadComponents() {
        // Get data for peak_load_component_table
        if (this.props.data && this.state.object_selection) {
            if (this.props.data[this.state.object_selection]) {
                return this.props.data[this.state.object_selection][this.state.peak_load_component_table]
            } else {
                return null
            }
        } else {
            return null
        }
    }

    getPeakConditionTable() {
        // Get data for peak_condition_table
        if (this.props.data && this.state.object_selection) {
            if (this.props.data[this.state.object_selection]) {
                return this.props.data[this.state.object_selection][this.state.peak_condition_table]
            } else {
                return null
            }
        } else {
            return null
        }
    }

    getEngineeringCheckTable() {
        // Get data for engineering_check_table
        if (this.props.data && this.state.object_selection) {  
            if (this.props.data[this.state.object_selection]) {
                return this.props.data[this.state.object_selection][this.state.engineering_check_table]
            } else {
                return null
            }
        } else {
            return null
        }
    }

    getHeatingAndCoolingLoads() {
        // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
        // Investigate further whether this should be a calculated value from the subcomponents.
        
        if (this.props.data) {
            const data = this.props.data[this.state.object_selection];

            if (data) {
                const peakCoolingLoad = data['cooling']['peak_condition']['sensible_peak'];
                const peakHeatingLoad = data['heating']['peak_condition']['sensible_peak'];
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
    }

    formatTableData(dataMapping, data) {
        // This function formats the data that will be displayed in the table.
        var newData = JSON.parse(JSON.stringify(data));
        var totals = {
            "latent": 0.0,
            "related_area": 0.0,
            "sensible_delayed": 0.0,
            "sensible_instant": 0.0,
            "sensible_return_air": 0.0,
            "total": 0.0,
            "percent_grand_total": 0.0
          };

        // Loop and calculate the table subtotals for each column
        if (newData) {
            dataMapping['rows'].map((row) => {
                Object.keys(totals 
                    ).map((colName) => {
                    var rowName = row['jsonKey'];
                    if (Object.keys(newData).includes(rowName) && rowName !== "total") {
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
    }

    formatLoadComponentChartData(dataMapping, data) {

        if (data) {
        // This function formats the data that will be displayed in a chart.
        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(dataMapping).map((group) => {
            var total = 0;
            // Loop again to total the loads for each load group
            dataMapping[group].map((loadComponent) => ( Object.keys(data).includes(loadComponent) ? total += data[loadComponent]['total'] : null ))
            newData.push({'name': group, 'value': parseInt(total)})
            return newData
        })

        return newData

        } else {
            return null
        }
    }

    render() {
        const loadData = this.getLoadComponents();
        const peakConditionsData = this.getPeakConditionTable();

        return (
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
                            dataMapping={this.props.dataMapping['headerTable']}
                            />
                        </Row>
                        <Row>
                            <span>Envelope</span>
                            <CustomTable
                            name={this.props.name + "-envelopeTable"}
                            displayHeader={false}
                            dataMapping={this.props.dataMapping['envelopeLoadsTable']}
                            data={this.formatTableData(this.props.dataMapping['envelopeLoadsTable'], loadData)}
                            />
                        </Row>
                        <Row>
                            <span>Internal Gains</span>
                            <CustomTable
                            name={this.props.name + "-internalGainTable"}
                            displayHeader={false}
                            dataMapping={this.props.dataMapping['internalGainsTable']}
                            data={this.formatTableData(this.props.dataMapping['internalGainsTable'], loadData)}
                            />
                        </Row>
                        <Row>
                            <span>Systems</span>
                            <CustomTable
                            name={this.props.name + "-systemLoadsTable"}
                            displayHeader={false}
                            dataMapping={this.props.dataMapping['systemLoadsTable']}
                            data={this.formatTableData(this.props.dataMapping['systemLoadsTable'], loadData)}
                            />
                        </Row>
                        <Row>
                            <span>Total</span>
                            <CustomTable
                            name={this.props.name + "-totalLoadsTable"}
                            displayHeader={false}
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
                            dataMapping={this.props.dataMapping['peakConditions']}
                            data={peakConditionsData}
                            />
                        </Row>
                        { this.props.name === 'systemLoadSummary' ? (
                            <Row>
                                <ReportCard
                                name={this.props.name + "-temperatures"}
                                title="Temperatures"
                                dataMapping={this.props.dataMapping['temperatures']}
                                data={peakConditionsData}
                                />
                            </Row>
                        ) : null }
                        { this.props.name === 'systemLoadSummary' ? (
                            <Row>
                                <ReportCard
                                name={this.props.name + "-airflows"}
                                title="Airflows"
                                dataMapping={this.props.dataMapping['temperatures']}
                                data={peakConditionsData}
                                />
                            </Row>
                        ) : null }
                        <Row>
                            <ReportCard
                            name={this.props.name + "-engineeringCheck"}
                            title="Engineering Checks"
                            dataMapping={this.props.dataMapping['engineeringCheck']}
                            data={this.getEngineeringCheckTable()}
                            />
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <CustomPieChart
                            name={this.props.name + "-peakLoadsChart"}
                            title={"Peak Loads [W]"}
                            colors={COOLINGHEATINGCOLORS}
                            data={this.getHeatingAndCoolingLoads()}
                            />
                        </Row>
                        <Row>
                            <CustomPieChart
                            name={this.props.name + "-loadComponentsChart"}
                            title={ this.state.heating_cooling_selection === 'cooling' ? 'Cooling Load Components [W]' : 'Heating Load Components [W]'}
                            colors={EQUIDISTANTCOLORS}
                            data={this.formatLoadComponentChartData(this.props.dataMapping['componentPieChart'], loadData)}
                            /> 
                        </Row>
                    </Col>
              </Row>
            </Tab.Container>
        );
    }
}