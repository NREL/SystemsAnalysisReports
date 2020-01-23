import React from 'react';
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { PeakConditionsCard } from '../Components/PeakConditionsCard';
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

export class SystemLoadSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heating_cooling_selection: "cooling_peak_load_component_table",
            system_selection: 0,
            num_systems: 0,
            system_list: [],
        };
    } 

    componentDidMount() {
        this.getSystemList()
    }

    handleSystemSelect(eventKey) {
        this.setState({
            system_selection: eventKey,
        });
    }

    handleHeatingCoolingSelect(eventKey) {
        this.setState({
            heating_cooling_selection: eventKey
        });
    }

    getSystemList() {
        // Get a list of system names, ids, and cad_object, ids
        var system_list = []
        for (var i = 0; i < this.props.data.length; i++) {
            system_list.push({id: i, cad_object_id: this.props.data[i].cad_object_id, name: this.props.data[i].name});
        }

        this.setState({system_list: system_list}) // Update state with list of systems
        this.setState({num_systems: system_list.length});  // Update state with number of systems
    }

    getSystemName(id) {
        // Get the string name of the system given an id
        for (var i = 0; i < this.state.system_list.length; i++) {
            if (this.state.system_list[i].id == id) {
                return this.state.system_list[i].name
            }
        }
    }

    getLoadComponents() {
        return this.props.data[this.state.system_selection][this.state.heating_cooling_selection];
    }

    formatChartData(data) {
        //const data = jsonData['system_loads_by_components'][this.system_selection][this.heating_cooling_selection];

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
                //"system_ventilation",
            ]
        }

        var newData = [];

        // Loop for loadGroups and sum all of the totals
        Object.keys(loadGroups).map((loadGroup) => {
            var total = 0;
            // Loop again to total the loads for each load group
            console.log(loadGroup);
            console.log(data);
            loadGroups[loadGroup].map((loadComponent) => total += data[loadComponent]['total'])
            newData.push({'name': loadGroup, 'value': total})
        })

        return newData
    }

    render() {
        const data = this.getLoadComponents();

        return (
            <Tab.Container id="system-loads-report" activeKey={this.state.heating_cooling_selection} defaultActiveKey="cooling_peak_load_component_table">
                <Row>
                        <Dropdown onSelect={this.handleSystemSelect.bind(this)} className="App-dropdown">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            { this.getSystemName(this.state.system_selection) }
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.state.system_list.map((system) => <Dropdown.Item eventKey={system.id}>{system.name}</Dropdown.Item>)}
                        </Dropdown.Menu>
                        </Dropdown>
                        <Nav variant="pills" onSelect={this.handleHeatingCoolingSelect.bind(this)} className="App-buttons">
                            <Nav.Item>
                            <Nav.Link eventKey="cooling_peak_load_component_table">Cooling</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="heating_peak_load_component_table">Heating</Nav.Link>
                            </Nav.Item>
                        </Nav>
                </Row>
                <Row>
                    <Col xs={6}><CustomTable rows={loadComponents} columns={loadTypes} data={data}/></Col>
                    <Col>
                        <Row><PeakConditionsCard/></Row>
                        <Row>
                            <CustomPieChart  yDataKey="value"  xDataKey={loadTypes} data={this.formatChartData(data)}/>
                        </Row>
                        <Row>
                            <CustomPieChart  yDataKey="value"  xDataKey={loadTypes} data={this.formatChartData(data)}/>
                        </Row>
                    </Col>
              </Row>
            </Tab.Container>
        );
    }
}