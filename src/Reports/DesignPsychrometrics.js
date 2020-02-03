import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { CustomTable } from '../Components/Table';
import { ReportCard } from '../Components/ReportCard';

const tableDataMapping = {
    "columns": [
        {"displayName": "Dry Bulb Temperature [C]", "jsonKey": "drybulb"},
        {"displayName": "Humidity Ratio [kg/kg]", "jsonKey": "hr"},
        {"displayName": "Tempeature Difference [C]", "jsonKey": "temp_diff"},
    ],
    "rows": [
        {"displayName": "Zone", "jsonKey": "zone"},
        {"displayName": "Return Air", "jsonKey": "return_air"},
        {"displayName": "Outdoor Air", "jsonKey": "oa"},
        {"displayName": "Entering Coil", "jsonKey": "entering_coil"},
        {"displayName": "Leaving Coil", "jsonKey": "leaving_coil"},
        {"displayName": "Supply Fan", "jsonKey": "supply_fan"},
    ]
};

const cardDataMapping = [
    {
        "label": null,
        "items": [
            {"displayName": "System Name", "jsonKey": "name", "unitLabel": null},
            {"displayName": "Time of Peak", "jsonKey": "time_of_peak", "unitLabel": null},
            {"displayName": "Coil Air Flow Rate", "jsonKey": "coil_air_flow", "unitLabel": "m3/s"},
            {"displayName": "Zone Space Sensible Load", "jsonKey": "zone_sensible_load", "unitLabel": "W"},
            {"displayName": "Outdoor Air Flow Rate", "jsonKey": "oa_flow_rate", "unitLabel": "m3/s"},
            {"displayName": "Percent Outdoor Air", "jsonKey": "percent_oa", "unitLabel": "%"},
            {"displayName": "Air Specific Heat", "jsonKey": "air_specific_heat", "unitLabel": "J-kg/K"}, 
            {"displayName": "Air Density", "jsonKey": "air_density", "unitLabel": "kg/m3"},           
        ]
    },
];

export class DesignPsychrometrics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    getObjectList() {
        // Get a list of object names, ids, and cad_object, ids
        var object_list = []
        for (var i = 0; i < this.props.data.length; i++) {
            object_list.push({id: i, cad_object_id: this.props.data[i].cad_object_id, name: this.props.data[i].name});
        }

        this.setState({object_list: object_list}) // Update state with list of objects
        this.setState({num_objects: object_list.length});  // Update state with number of objects
    }

    formatTableData(dataMapping, data) {
        // This function formats the data that will be displayed in the table.
        var newData = {};

        // Loop for each row
        dataMapping['rows'].map((row) => {
            var rowKey = row['jsonKey'];
            newData[rowKey] = {};
            
            // Loop for each column
            dataMapping['columns'].map((column) => {
                var colKey = column['jsonKey'];
                var dataKey = rowKey + '_' + colKey; // The jsonKey for retrieving data
                newData[rowKey][colKey] = data[dataKey];
                return newData
            })
            return newData
        })

        return newData
    }

    render() {
        const data = this.props.data[this.state.object_selection];

        return (
            <Container id={this.props.name + '-container'}>
            <Row>
                <ObjectSelectionDropDown
                name={this.props.name + "-objectDropdown"}
                objectList={this.state.object_list}
                objectSelection={this.state.object_selection}
                handleObjectSelect={this.handleObjectSelect.bind(this)}
                />
            </Row>
            <Row>
                <Col>
                <CustomTable
                name={this.props.name + "-statePointTable"}
                displayHeader={true}
                dataMapping={tableDataMapping}
                data={this.formatTableData(tableDataMapping, data)}
                />
                </Col>
                <Col>
                <ReportCard
                name={this.props.name + "-conditionsTimePeak"}
                title="Summary"
                dataMapping={cardDataMapping}
                data={data}
                />
                </Col>
          </Row>
        </Container>
        );
    }
}