import React from 'react';
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { ReportCard } from '../Components/ReportCard';
import { CustomTable } from '../Components/Table';
import { CustomPieChart } from '../Components/PieChart';

const loadTypes = {
    "sensible_instant": "Instant Sensible (W)",
    "sensible_delayed":"Delayed Sensible (W)",
    "latent": "Latent (W)",
    "total": "Total (W)",
    "percent_grand_total": "Percent of Total (%)",
};

const loadComponents = {
    "roof": "Roof",
    "other_roof": "Other - Roof",
    "interzone_ceiling": "Ceiling",
    "fenestration_conduction": "Glass - Conduction",
    "fenestration_solar": "Glass - Solar",
    "opaque_door": "Door",
    "exterior_wall": "Wall",
    "ground_contact_wall": "Below-grade Wall",
    "interzone_wall": "Partition",
    "other_wall": "Other - Wall",
    "exterior_floor": "Exterior Floor",
    "interzone_floor": "Interior Floor",
    "ground_contact_floor": "Slab",
    "other_floor": "Other - Floor",
    "infiltration": "Infiltration",
    "people": "People",
    "lights": "Lights",
    "equipment": "Equipment",
    "power_generation_equipment": "Power Generation Equipment",
    "refrigeration": "Refrigeration",
    "water_use_equipment": "Water Use Equipment",
    "hvac_equipment_loss": "HVAC Equipment Loss",
    "zone_ventilation": "Zone Ventilation",
    "interzone_mixing": "Transfer Air",
    "doas_direct_to_zone": "DOAS Direct to Zone",
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

    formatChartData(data) {
        // This variable defines the load component keys assigned to each load group.  These are used to create a radial bar chart of the load components.
        const loadGroups = {
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

        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(loadGroups).map((loadGroup) => {
            var total = 0;
            // Loop again to total the loads for each load group
            loadGroups[loadGroup].map((loadComponent) => total += data[loadComponent]['total'])
            newData.push({'name': loadGroup, 'value': total})
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
                        <CustomTable rows={loadComponents} columns={loadTypes} data={loadData}/>
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
                            <CustomPieChart  yDataKey="value"  xDataKey={loadTypes} data={this.formatChartData(loadData)}/>
                        </Row>
                        <Row>
                            <CustomPieChart  yDataKey="value"  xDataKey={loadTypes} data={this.formatChartData(loadData)}/>
                        </Row>
                    </Col>
              </Row>
            </Tab.Container>
        );
    }
}