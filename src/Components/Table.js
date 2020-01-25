import React from 'react';
import Table from 'react-bootstrap/Table'

export class CustomTable extends React.Component {
    addDataRow(rows, columns, data) {
        const rowKey = rows['jsonKey'];
        var rowData = data[rowKey];
        return (
            <tr key={ this.props.name + '-' + rowKey }>
            <td width="200">{ rows['displayName']}</td>
            { columns.map((column) => <td key={ this.props.name + '-' + rowKey + '-' + column['jsonKey'] } width="80">{ rowData[column['jsonKey']] }</td>) }
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