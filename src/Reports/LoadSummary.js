import React from 'react';
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { ReportCard } from '../Components/ReportCard';
import { CustomTable } from '../Components/Table';
import { CustomPieChart } from '../Components/PieChart';

const EQUIDISTANTCOLORS = ["#003f5c","#374c80","#7a5195","#bc5090","#ef5675","#ff764a","#ffa600"];

const COOLINGHEATINGCOLORS = ["#3399FF", "#FF3333"];

const envelopeLoadsTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
    ],
    "rows": [
        {"displayName": "Roof", "jsonKey": "roof"},
        {"displayName": "Other - Roof", "jsonKey": "other_roof"},
        {"displayName": "Ceiling", "jsonKey": "interzone_ceiling"},
        {"displayName": "Glass - Conduction", "jsonKey": "fenestration_conduction"},
        {"displayName": "Glass - Solar", "jsonKey": "fenestration_solar"},
        {"displayName": "Door", "jsonKey": "opaque_door"},
        {"displayName": "Wall", "jsonKey": "exterior_wall"},
        {"displayName": "Below-grade Wall", "jsonKey": "ground_contact_wall"},
        {"displayName": "Partition", "jsonKey": "interzone_wall"},
        {"displayName": "Other - Wall", "jsonKey": "other_wall"},
        {"displayName": "Exterior Floor", "jsonKey": "exterior_floor"},
        {"displayName": "Interior Floor", "jsonKey": "interzone_floor"},
        {"displayName": "Slab", "jsonKey": "ground_contact_floor"},
        {"displayName": "Other - Floor", "jsonKey": "other_floor"},
        {"displayName": "Total", "jsonKey": "total"},
    ]
};

const internalGainTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
    ],
    "rows": [
        {"displayName": "People", "jsonKey": "people"},
        {"displayName": "Lights", "jsonKey": "lights"},
        {"displayName": "Return Air - Lights", "jsonKey": "return_air_lights"},
        {"displayName": "Equipment", "jsonKey": "equipment"},
        {"displayName": "Total", "jsonKey": "total"},
    ]
};

const systemsLoadsTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
    ],
    "rows": [
        {"displayName": "Return Air - Other", "jsonKey": "return_air_other"},
        {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
        {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
        {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
        {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
        {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
        {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
        {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
        {"displayName": "Total", "jsonKey": "total"},
    ]
};

const peakConditionTableMapping = [
    {
        "label": "Outside",
        "items": [
            {"displayName": "DB", "jsonKey": "oa_drybulb", "unitLabel": "C"},
            {"displayName": "HR", "jsonKey": "oa_hr", "unitLabel": "kg/kg"},
            {"displayName": "WB", "jsonKey": "oa_wetbulb", "unitLabel": "C"}
        ]
    },
    {
        "label": "Zone",
        "items": [
            {"displayName": "DB", "jsonKey": "zone_drybulb", "unitLabel": "C"},
            {"displayName": "HR", "jsonKey": "zone_hr", "unitLabel": "kg/kg"},
            {"displayName": "WB", "jsonKey": "zone_rh", "unitLabel": "C"}
        ]
    }
];

const componentPieChartMapping = {
    "Envelope": [
        "infiltration",
        "ground_contact_floor",
        "ground_contact_wall",
        "fenestration_conduction",
        "opaque_door",
        "other_floor",
        "other_roof",
        "other_wall",
        "roof",
        "exterior_floor",
        "exterior_wall",
    ],
    "Solar": [
        "fenestration_solar",
    ],
    "Interzone": [
        "interzone_ceiling",
        "interzone_floor",
        "interzone_mixing",
        "interzone_wall",
    ],
    "Equipment": [
        "equipment",
    ],
    "Lights": [
        "lights",
    ],
    "People": [
        "people",
    ],
    "HVAC": [
        "doas_direct_to_zone",
        "hvac_equipment_loss",
        "power_generation_equipment",
        "refrigeration",
        "water_use_equipment",
        "zone_ventilation",
    ]
}

const engineeringCheckTableMapping = [
    {
        "label": null,
        "items": [
            {"displayName": "m3/s-m2", "jsonKey": "airflow_per_floor_area", "unitLabel": null},
        ]
    },
    {
        "label": null,
        "items": [
            {"displayName": "people", "jsonKey": "number_of_people", "unitLabel": null},
        ]
    }
];

export class LoadSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heating_cooling_selection: "cooling",
            engineering_check_table: "cooling_engineering_check_table",
            peak_condition_table: "cooling_peak_condition_table",
            peak_load_component_table: "cooling_peak_load_component_table",
            lighting_adjusted: false,
            object_selection: 0,
            num_objects: 0,
            object_list: [],
        };
    } 

    componentDidMount() {
        this.getObjectList()
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
        for (var i = 0; i < this.props.data.length; i++) {
            object_list.push({id: i, cad_object_id: this.props.data[i].cad_object_id, name: this.props.data[i].name});
        }

        this.setState({object_list: object_list}) // Update state with list of objects
        this.setState({num_objects: object_list.length});  // Update state with number of objects
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
        return this.props.data[this.state.object_selection][this.state.peak_load_component_table];
    }

    getPeakConditionTable() {
        // Get data for peak_condition_table
        return this.props.data[this.state.object_selection][this.state.peak_condition_table];
    }

    getEngineeringCheckTable() {
        // Get data for engineering_check_table
        return this.props.data[this.state.object_selection][this.state.engineering_check_table];
    }

    getHeatingAndCoolingLoads() {
        // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
        // Investigate further whether this should be a calculated value from the subcomponents.
        const data = this.props.data[this.state.object_selection];
        const peakCoolingLoad = data['cooling_peak_condition_table']['sensible_peak'];
        const peakHeatingLoad = data['heating_peak_condition_table']['sensible_peak'];
        const output = [ 
            {'name': 'Cooling', 'value': Math.abs(peakCoolingLoad)}, 
            {'name': 'Heating', 'value': Math.abs(peakHeatingLoad)}
        ]

        return output
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
          };

        // Loop and calculate the totals for each column
        dataMapping['rows'].map((row) => {
            Object.keys(totals).map((colName) => {
                //console.log(row);
                var rowName = row['jsonKey'];
                if (Object.keys(newData).includes(rowName) && rowName !== "total") {
                    totals[colName] += newData[rowName][colName]
                }
                return totals
            })
            return totals
        });

        // Add total row to the data object
        newData["total"] = totals;

        return newData
    }

    formatLoadComponentChartData(dataMapping, data) {
        // This function formats the data that will be displayed in a chart.
        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(dataMapping).map((group) => {
            var total = 0;
            // Loop again to total the loads for each load group
            dataMapping[group].map((loadComponent) => total += data[loadComponent]['total'])
            newData.push({'name': group, 'value': total})
            return newData
        })

        return newData
    }

    render() {
        const loadData = this.getLoadComponents();
        const peakConditionsData = this.getPeakConditionTable();

        return (
            <Tab.Container id={this.props.name + '-container'} activeKey={this.state.heating_cooling_selection} defaultActiveKey="cooling">
                <Row>
                        <Dropdown onSelect={this.handleObjectSelect.bind(this)} className="App-dropdown">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            { this.getObjectName(this.state.object_selection) }
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            { this.state.object_list.map((item) => (
                                <Dropdown.Item
                                key={this.props.name + '-' + item.name}
                                eventKey={item.id}
                                >
                                {item.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        </Dropdown>
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
                    <Col>
                        <Row>
                            <CustomTable
                            name={this.props.name + "-envelopeTable"}
                            displayHeader={true}
                            dataMapping={envelopeLoadsTableMapping}
                            data={this.formatTableData(envelopeLoadsTableMapping, loadData)}
                            />
                        </Row>
                        <Row>
                            <CustomTable
                            name={this.props.name + "-internalGainTable"}
                            displayHeader={false}
                            dataMapping={internalGainTableMapping}
                            data={this.formatTableData(internalGainTableMapping, loadData)}
                            />
                        </Row>
                        <Row>
                            <CustomTable
                            name={this.props.name + "-systemLoadsTable"}
                            displayHeader={false}
                            dataMapping={systemsLoadsTableMapping}
                            data={this.formatTableData(systemsLoadsTableMapping, loadData)}
                            />
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <ReportCard
                            name={this.props.name + "-conditionsTimePeak"}
                            title="Conditions at Time of Peak"
                            dataMapping={peakConditionTableMapping}
                            data={peakConditionsData}
                            />
                        </Row>
                        <Row>
                            <ReportCard
                            name={this.props.name + "-engineeringCheck"}
                            title="Engineering Check"
                            dataMapping={engineeringCheckTableMapping}
                            data={this.getEngineeringCheckTable()}
                            />
                        </Row>
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
                            data={this.formatLoadComponentChartData(componentPieChartMapping, loadData)}
                            /> 
                        </Row>
                    </Col>
              </Row>
            </Tab.Container>
        );
    }
}