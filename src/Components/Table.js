import React from 'react';
import Table from 'react-bootstrap/Table'

export class MyTable extends React.Component {
    addDataRow(rows, columns, rowKey, data) {
        var rowData = data[rowKey];
        return (
            <tr>
            <td key={ rowKey }>{ rows[rowKey] }</td>
            { Object.keys(columns).map((columnKey) => <td>{ rowData[columnKey] }</td>) }
            </tr>
        );
    }

    render() {
        var { rows, columns, data } = this.props;

        return (
            <Table striped bordered hover responsive className="App-table">
            <thead>
            <tr>
                <th key="Table Header"></th>
                { Object.keys(columns).map((columnKey) => <th key={ columnKey }>{ columns[columnKey] }</th>) }
            </tr>
            </thead>
            <tbody>
                { Object.keys(data).map((rowKey) => this.addDataRow(rows, columns, rowKey, data)) }
            </tbody>
            </Table>
        );
    }
}