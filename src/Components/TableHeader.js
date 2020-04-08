import React from 'react';
import Table from 'react-bootstrap/Table'

export default function TableHeader(props) {
    var { name, dataMapping } = props;

    return (
        <Table striped bordered hover responsive size="sm" className="App-table">
        <thead>
        <tr key={ name + '-header' }>
            <th  key={ name + '-label-header' } width="25%"></th>
            { dataMapping['columns'].map((column) => (
                <th
                key={ name + '-' + column['displayName'] + '-header' }
                width="15%"
                >
                { column['displayName'] }
                </th>
            ))
            }
        </tr>
        </thead>
        </Table>
    );
}