import React from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { MyTable } from '../Components/Table';
import { CustomPieChart } from '../Components/PieChart';
import myJson from '../complete_set.json';

export class PeakZoneLoadReport extends React.Component {
    formatChartData = (data) => {

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

        console.log(newData);

        return newData
    }

    render() {
        const jsonData = myJson;
        const data = jsonData['zone_loads_by_components'][0]['cooling_peak_load_component_table'];

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

        return (
            <Container>
              <Row>
                <Col xs={6}><MyTable rows={loadComponents} columns={loadTypes} data={data}/></Col>
                <Col><CustomPieChart  yDataKey="total"  xDataKey={loadTypes} data={this.formatChartData(data)}/></Col>
              </Row>
            </Container>
        );
    }
}