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

const loadTableMapping = {
    "columns": [
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
        {"displayName": "Infiltration", "jsonKey": "infiltration"},
        {"displayName": "People", "jsonKey": "people"},
        {"displayName": "Lights", "jsonKey": "lights"},
        {"displayName": "Equipment", "jsonKey": "equipment"},
        {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
        {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
        {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
        {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
        {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
        {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
        {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"}
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
            zone_selection: 0,
            num_zones: 0,
            zone_list: [],
        };
    } 

    componentDidMount() {
        this.getZoneList()
    }

    handleZoneSelect(eventKey) {
        // Update state when user selects a zone from dropdown
        this.setState({
            zone_selection: eventKey,
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

    getZoneList() {
        // Get a list of zone names, ids, and cad_object, ids
        var zone_list = []
        for (var i = 0; i < this.props.data.length; i++) {
            zone_list.push({id: i, cad_object_id: this.props.data[i].cad_object_id, name: this.props.data[i].name});
        }

        this.setState({zone_list: zone_list}) // Update state with list of zones
        this.setState({num_zones: zone_list.length});  // Update state with number of zones
    }

    getZoneName(id) {
        // Get the string name of the zone given an id
        for (var i = 0; i < this.state.zone_list.length; i++) {
            if (this.state.zone_list[i].id == id) {
                return this.state.zone_list[i].name
            }
        }
    }

    getLoadComponents() {
        // Get data for zone_load_by_components and peak_load_component_table
        return this.props.data[this.state.zone_selection][this.state.peak_load_component_table];
    }

    getPeakConditionTable() {
        // Get data for zone_load_by_components and peak_condition_table
        return this.props.data[this.state.zone_selection][this.state.peak_condition_table];
    }

    getEngineeringCheckTable() {
        // Get data for zone_load_by_components and engineering_check_table
        return this.props.data[this.state.zone_selection][this.state.engineering_check_table];
    }

    getHeatingAndCoolingLoads() {
        // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
        // Investigate further whether this should be a calculated value from the subcomponents.
        const data = this.props.data[this.state.zone_selection];
        const peakCoolingLoad = data['cooling_peak_condition_table']['sensible_peak'];
        const peakHeatingLoad = data['heating_peak_condition_table']['sensible_peak'];
        const output = [ 
            {'name': 'Cooling', 'value': Math.abs(peakCoolingLoad)}, 
            {'name': 'Heating', 'value': Math.abs(peakHeatingLoad)}
        ]

        return output
    }

    formatLoadComponentChartData(dataMapping, data) {
        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(dataMapping).map((group) => {
            var total = 0;
            // Loop again to total the loads for each load group
            dataMapping[group].map((loadComponent) => total += data[loadComponent]['total'])
            newData.push({'name': group, 'value': total})
        })

        return newData
    }

    render() {
        const loadData = this.getLoadComponents();
        const peakConditionsData = this.getPeakConditionTable();

        return (
            <Tab.Container id="zone-loads-report" activeKey={this.state.heating_cooling_selection} defaultActiveKey="cooling">
                <Row>
                        <Dropdown onSelect={this.handleZoneSelect.bind(this)} className="App-dropdown">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            { this.getZoneName(this.state.zone_selection) }
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.state.zone_list.map((zone) => <Dropdown.Item eventKey={zone.id}>{zone.name}</Dropdown.Item>)}
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
                        <CustomTable dataMapping={loadTableMapping} data={loadData}/>
                    </Col>
                    <Col>
                        <Row>
                            <ReportCard
                            title="Conditions at Time of Peak"
                            dataMapping={peakConditionTableMapping}
                            data={peakConditionsData}
                            />
                        </Row>
                        <Row>
                            <ReportCard
                            title="Engineering Check"
                            dataMapping={engineeringCheckTableMapping}
                            data={this.getEngineeringCheckTable()}
                            />
                        </Row>
                        <Row>
                            <CustomPieChart
                            title={"Peak Loads [W]"}
                            colors={COOLINGHEATINGCOLORS}
                            data={this.getHeatingAndCoolingLoads()}
                            />
                        </Row>
                        <Row>
                            <CustomPieChart
                            title={ this.state.heatingCoolingSelection === 'cooling' ? 'Cooling Load Components [W]' : 'Heating Load Components [W]'}
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