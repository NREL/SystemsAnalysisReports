import React from 'react';
import Table from 'react-bootstrap/Table'

export class CustomTable extends React.Component {
    addDataRow(rows, columns, data) {
        const rowKey = rows['jsonKey'];
        var rowData = data[rowKey];
        return (
            <tr>
            <td key={ rowKey } width="200">{ rows['displayName']}</td>
            { columns.map((column) => <td width="80">{ rowData[column['jsonKey']] }</td>) }
            </tr>
        );
    }

    //width={ rowData[column['width']] }

    render() {
        var { displayHeader, dataMapping, data } = this.props;

        const headerStyle = displayHeader === true ? null : {"display":"none"};

        return (
            <Table striped bordered hover responsive size="sm" className="App-table">
            <thead style={headerStyle}>
            <tr>
                <th key="Table Header"  width="300"></th>
                { dataMapping['columns'].map((column) => <th key={ column } width="100">{ column['displayName'] }</th>) }
            </tr>
            </thead>
            <tbody>
                { dataMapping['rows'].map((row) => this.addDataRow(row, dataMapping['columns'], data)) }
            </tbody>
            </Table>
        );
    }
}