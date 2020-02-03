import React from 'react';
import Table from 'react-bootstrap/Table'

export class CustomTable extends React.Component {
    addDataRow(row, columns, data) {
        const rowKey = row['jsonKey'];
        var rowData = data[rowKey];

        return (
            <tr key={ this.props.name + '-' + rowKey }>
            <td width="200">{ row['displayName']}</td>
            { columns.map((column) => {
                var dataValue = null;
                var decimals = 1;

                if (Object.keys(rowData).includes(column['jsonKey'])) {
                    // Truncate numeric value based on desired decimals
                    if (Object.keys(column).includes('decimals')) {
                        decimals = column['decimals'];
                    }
                    if ( rowData[column['jsonKey']] ) {
                        // Set value to display with decimal value truncation
                        dataValue = rowData[column['jsonKey']].toFixed(decimals);
                    } else {
                        // Set value to null if none exists in data
                        dataValue = null;
                    }
                }

                return (
                    <td
                    key={ this.props.name + '-' + rowKey + '-' + column['jsonKey'] }
                    width="80"
                    >
                        { ( Object.keys(rowData).includes(column['jsonKey']) ) ? dataValue : null }
                    </td>
                )
            })}
            </tr>
        );
    }

    render() {
        var { displayHeader, dataMapping, data } = this.props;

        const headerStyle = displayHeader === true ? null : {"display":"none"};

        return (
            <Table striped bordered hover responsive size="sm" className="App-table">
            <thead style={headerStyle}>
            <tr key={ this.props.name + '-header' }>
                <th  key={ this.props.name + '-label-header' } width="300"></th>
                { dataMapping['columns'].map((column) => (
                    <th
                    key={ this.props.name + '-' + column['displayName'] + '-header' }
                    width="100"
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