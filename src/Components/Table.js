import React from 'react';
import Table from 'react-bootstrap/Table'
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';

export class CustomTable extends React.Component {
    addDataRow(row, columns, data) {
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
                        var decimals = 1;
                        
                        if (rowData) {
                            if (Object.keys(rowData).includes(column['jsonKey'])) {
                                // Truncate numeric value based on desired decimals
                                if (Object.keys(column).includes('decimals')) {
                                    decimals = column['decimals'];
                                }

                                if ( isNumeric(rowData[column['jsonKey']]) ) {
                                    // Set value to display with decimal value truncation
                                    dataValue = numberWithCommas(rowData[column['jsonKey']].toFixed(decimals));
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
        var { displayHeader, dataMapping, data } = this.props;

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
                    { column['displayName'] }
                    </th>
                ))
                }
            </tr>
            </thead>
            <tbody>
                { dataMapping['rows'].map((row) => this.addDataRow(row, dataMapping['columns'], data)) }
            </tbody>
            </Table>
        );
    }
}