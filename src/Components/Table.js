import React from 'react';
import Table from 'react-bootstrap/Table'
import { getHeader } from '../functions/tableFunctions';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';

export class CustomTable extends React.Component {
    addDataRow(unitSystem, row, columns, data) {
        const rowKey = row['jsonKey'];
        
        if (data) {
            var rowData = data[rowKey];

            //if (rowData) {
                return (
                    <tr key={ this.props.name + '-' + rowKey }>
                    <td width="25%">
                        { ( ['subtotal', 'grand_total'].includes(rowKey) ? <i>{row['displayName']}</i> : row['displayName']) }
                    </td>
                    { columns.map((column) => {
                        var dataValue = null;
                        
                        if (rowData) {
                            if (Object.keys(rowData).includes(column['jsonKey'])) {
                                if ( isNumeric(rowData[column['jsonKey']]) ) {
                                    const type = column["type"];

                                    // convert unit system
                                    dataValue = convertDataUnit(unitSystem, type, rowData[column['jsonKey']])

                                    // Set value to display as number with commas
                                    dataValue = numberWithCommas(dataValue);

                                } else {
                                    // Set value to null if none exists in data
                                    dataValue = '-';
                                }
                            }
                        } else {
                            dataValue = '-'
                        }

                        return (
                            <td
                            key={ this.props.name + '-' + rowKey + '-' + column['jsonKey'] }
                            width="15%"
                            >
                                {  ['subtotal', 'grand_total'].includes(rowKey) ? <i>{dataValue}</i> : dataValue }
                            </td>
                        )
                        
                    })}
                    </tr>
                );
            //}
        }
    }

    render() {
        var { displayHeader, unitSystem, dataMapping, data } = this.props;

        const headerStyle = displayHeader === true ? null : {"display":"none"};

        return (
            <Table striped bordered hover responsive size="sm" className="App-table">
            <thead style={headerStyle}>
            <tr key={ this.props.name + '-header' }>
                <th  key={ this.props.name + '-label-header' } width="25%"></th>
                { dataMapping['columns'].map((column) => (
                    <th
                    key={ this.props.name + '-' + column['displayName'] + '-header' }
                    width="15%"
                    >
                    { getHeader(unitSystem, column) }
                    </th>
                ))
                }
            </tr>
            </thead>
            <tbody>
                { dataMapping['rows'].map((row) => this.addDataRow(unitSystem, row, dataMapping['columns'], data)) }
            </tbody>
            </Table>
        );
    }
}