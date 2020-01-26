import React from 'react';
import { CustomTable } from '../Components/Table';

const dataMapping = {
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

export class DesignPsychrometrics extends React.Component {

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
        const data = this.props.data[0];

        return (
            <div>
                <p>Name {data.name}</p>
                <p>Air Density {data.air_density}</p>
                <p>Air Specific Heat  {data.air_specific_heat}</p>
                <p>OA Dry Bulb {data.oa_drybulb} C</p>
                <p>OA Flow Rate {data.oa_flow_rate} m3/s</p>
                <CustomTable
                name={this.props.name + "-statePointTable"}
                displayHeader={true}
                dataMapping={dataMapping}
                data={this.formatTableData(dataMapping, data)}
                />
            </div>
        );
    }
}