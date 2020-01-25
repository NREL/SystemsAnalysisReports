import React from 'react';
import Table from 'react-bootstrap/Table'

export class CustomTable extends React.Component {
    addDataRow(rows, columns, data) {
        const rowKey = rows['jsonKey'];
        var rowData = data[rowKey];
        return (
            <tr>
            <td key={ rowKey }>{ rows['displayName']}</td>
            { columns.map((column) => <td>{ rowData[column['jsonKey']] }</td>) }
            </tr>
        );
    }

    render() {
        var { dataMapping, data } = this.props;

        return (
            <Table striped bordered hover responsive size="sm" className="App-table">
            <thead>
            <tr>
                <th key="Table Header"></th>
                { dataMapping['columns'].map((column) => <th key={ column }>{ column['displayName'] }</th>) }
            </tr>
            </thead>
            <tbody>
                { dataMapping['rows'].map((row) => this.addDataRow(row, dataMapping['columns'], data)) }
            </tbody>
            </Table>
        );
    }
}