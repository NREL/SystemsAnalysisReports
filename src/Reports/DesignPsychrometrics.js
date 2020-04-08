import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { CustomTable } from '../Components/Table';
import { ReportCard } from '../Components/ReportCard';

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

        if (this.props.data) {
            const objList = Object.keys(this.props.data);
            for (var i = 0; i < objList.length; i++) {
                const objName = objList[i];
                object_list.push({id: i, cad_object_id: this.props.data[objName].cad_object_id, name: this.props.data[objName].name});
            }
            
            this.setState({object_list: object_list}) // Update state with list of objects
            this.setState({num_objects: object_list.length});  // Update state with number of objects
        }
    }

    getObjectName(id) {
        // Get the string name of the object given an id
        const objectList = this.state.object_list;
        for (var i = 0; i < objectList.length; i++) {
            if (objectList[i].id.toString() === id.toString()) {
                return objectList[i].name
            }
        }
    }

    formatTableData(dataMapping, data) {
        // This function formats the data that will be displayed in the table.
        if(data) {
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
        } else {
            return null
        }
    }

    render() {
        const objectName = this.getObjectName(this.state.object_selection);
        const data = this.props.data[objectName];

        return (
        <Tab.Container id={this.props.name + '-container'}>
            <Row>
                <Col className='text-left'>
                    <ObjectSelectionDropDown
                    name={this.props.name + "-objectDropdown"}
                    objectList={this.state.object_list}
                    objectSelection={this.state.object_selection}
                    handleObjectSelect={this.handleObjectSelect.bind(this)}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CustomTable
                    name={this.props.name + "-statePointTable"}
                    displayHeader={true}
                    dataMapping={this.props.dataMapping['componentTable']}
                    data={this.formatTableData(this.props.dataMapping['componentTable'], data)}
                    />
                </Col>
                <Col>
                    <ReportCard
                    name={this.props.name + "-conditionsTimePeak"}
                    title="Summary"
                    dataMapping={this.props.dataMapping['componentChecks']}
                    data={data}
                    />
                </Col>
          </Row>
        </Tab.Container>
        );
    }
}