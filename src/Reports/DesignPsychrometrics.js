import React, { useContext, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { CustomTable } from '../Components/Table';
import { ReportCard } from '../Components/ReportCard';
import { Context } from '../store/index';

export function DesignPsychrometrics(props) {
    const { 
        name,
        objectSelection,
        handleObjectSelect,
        dataMapping,
        data
    } = props;

    const { 
        sectionSelection, 
        unitSystem, 
        coilId, setCoilId 
    } = useContext(Context);
    const [ dataExists, setDataExists ] = useState(false);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");

    useEffect(() => {
        // Set data_exists state to false if data object is empty
        if (data && Object.keys(data).length === 0) {
            setDataExists(false);
        } else {
            setDataExists(true);
        }
    }, [data]);
    
    /*const handleObjectSelect = (eventKey) => {
        // Update state when user selects a object from dropdown
        this.setState({
            object_selection: eventKey,
        });
    }*/

    const getObjectList = (data) => {
        // Get a list of object names, ids, and cad_object, ids
        var object_list = [];

        if (data) {
            const objList = Object.keys(data);
            for (var i = 0; i < objList.length; i++) {
                const objName = objList[i];
                object_list.push({id: i, cad_object_id: data[objName].cad_object_id, name: data[objName].name});
            }
        }

        return object_list
    }

    const getObjectName = (objectList, id) => {
        // Get the string name of the object given an id
        //const objectList = this.state.object_list;
        for (var i = 0; i < objectList.length; i++) {
            if (objectList[i].id.toString() === id.toString()) {
                return objectList[i].name
            }
        }
    }

    const formatTableData = (dataMapping, data) => {
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

    const objectList = getObjectList(data);
    const objectName = getObjectName(objectList, objectSelection);
    const objectData = data[objectName];

    return (
        ( dataExists ?
            <Tab.Container id={name + '-container'}>
                <Row>
                    <Col className='text-left'>
                        <ObjectSelectionDropDown
                        name={name + "-objectDropdown"}
                        objectList={objectList}
                        objectSelection={objectSelection}
                        handleObjectSelect={handleObjectSelect}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CustomTable
                        name={name + "-statePointTable"}
                        displayHeader={true}
                        unitSystem={unitSystem}
                        dataMapping={dataMapping['componentTable']}
                        data={formatTableData(dataMapping['componentTable'], objectData)}
                        />
                    </Col>
                    <Col>
                        <ReportCard
                        name={name + "-conditionsTimePeak"}
                        title="Summary"
                        unitSystem={unitSystem}
                        dataMapping={dataMapping['componentChecks']}
                        data={objectData}
                        />
                    </Col>
            </Row>
            </Tab.Container>
        : 
            <h1>No system coils found.</h1> 
        )
    );
}