import React from 'react';
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab';
import { MyTable } from '../Components/Table';
import { CustomPieChart } from '../Components/PieChart';

const loadTypes = {
    "latent": "Latent",
    "related_area": "Related Area",
    "sensible_delayed":"Sensible Delayed",
    "sensible_instant": "Sensible Instant",
    "sensible_return_air": "Sensible Return Air",
    "total": "Total",
    "total_per_area": "Total Per Area",
    "percent_grand_total": "Percent Grand Total",
};

const loadComponents = {
    "doas_direct_to_zone": "DOAS Direct to Zone",
    "equipment": "Equipment",
    "exterior_floor": "Exterior Floor",
    "exterior_wall": "Exterior Wall",
    "fenestration_conduction": "Fenestration - Conduction",
    "fenestration_solar": "Fenestration - Solar",
    "grand_total": "Grand Total",
    "ground_contact_floor": "Ground Contact Floor",
    "ground_contact_wall": "Ground Contact Wall",
    "hvac_equipment_loss": "HVAC Equipment Loss",
    "infiltration": "Infiltration",
    "interzone_ceiling": "Interzone - Ceiling",
    "interzone_floor": "Interzone Floor",
    "interzone_mixing": "Interzone - Mixing",
    "interzone_wall": "Interzone - Wall",
    "lights": "Lights",
    "opaque_door": "Opaque Door",
    "other_floor": "Other - Floor",
    "other_roof": "Other - Roof",
    "other_wall": "Other - Wall",
    "people": "People",
    "power_generation_equipment": "Power Generation Equipment",
    "refrigeration": "Refrigeration",
    "roof": "Roof",
    "water_use_equipment": "Water Use Equipment",
    "zone_ventilation": "Zone Ventilation",
};

export class ZoneLoadSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heating_cooling_selection: "cooling_peak_load_component_table",
            zone_selection: 0,
            num_zones: 0,
            zone_list: [],
        };
    } 

    componentDidMount() {
        this.getZoneList()
    }

    handleZoneSelect = (eventKey) => {
        this.setState({
            zone_selection: eventKey
        });
    }

    handleHeatingCoolingSelect = (eventKey) => {
        this.setState({
            heating_cooling_selection: eventKey
        });
    }

    getZoneList = () => {
        // Get a list of zone names, ids, and cad_object, ids
        var zone_list = []
        for (var i = 0; i < this.props.data.length; i++) {
            zone_list.push({id: i, cad_object_id: this.props.data[i].cad_object_id, name: this.props.data[i].name});
        }

        this.setState({zone_list: zone_list}) // Update state with list of zones
        this.setState({num_zones: zone_list.length});  // Update state with number of zones
    }

    getZoneName = (id) => {
        // Get the string name of the zone given an id
        for (var i = 0; i < this.state.zone_list.length; i++) {
            if (this.state.zone_list[i].id == id) {
                return this.state.zone_list[i].name
            }
        }
    }

    getLoadComponents = () => {
        return this.props.data[this.state.zone_selection][this.state.heating_cooling_selection];
    }

    formatChartData = (data) => {
        //const data = jsonData['zone_loads_by_components'][this.zone_selection][this.heating_cooling_selection];

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
            newData.push({'name': loadGroup, 'total': total})
        })

        return newData
    }

    render() {
        const data = this.getLoadComponents();

        return (
            <Tab.Container id="zone-loads-report" defaultActiveKey="cooling">
                <Row>
                        <Dropdown onSelect={this.handleZoneSelect}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            { this.getZoneName(this.state.zone_selection) }
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.state.zone_list.map((zone) => <Dropdown.Item eventKey={zone.id}>{zone.name}</Dropdown.Item>)}
                        </Dropdown.Menu>
                        </Dropdown>
                        <Nav variant="pills" onSelect={this.handleHeatingCoolingSelect}>
                            <Nav.Item>
                            <Nav.Link eventKey="cooling_peak_load_component_table">Cooling</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="heating_peak_load_component_table">Heating</Nav.Link>
                            </Nav.Item>
                        </Nav>
                </Row>
                <Row>
                    <Col xs={6}><MyTable rows={loadComponents} columns={loadTypes} data={data}/></Col>
                    <Col>
                        <Row>
                            <CustomPieChart  yDataKey="total"  xDataKey={loadTypes} data={this.formatChartData(data)}/>
                        </Row>
                        <Row>
                            <CustomPieChart  yDataKey="total"  xDataKey={loadTypes} data={this.formatChartData(data)}/>
                        </Row>
                        <Row>
                            <CustomPieChart  yDataKey="total"  xDataKey={loadTypes} data={this.formatChartData(data)}/>
                        </Row>
                    </Col>
              </Row>
            </Tab.Container>
        );
    }
}