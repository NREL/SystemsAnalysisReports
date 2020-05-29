import React from 'react';
import Table from 'react-bootstrap/Table'
import { getHeader } from '../functions/tableFunctions';
import { getUnitLabel } from '../functions/dataFormatting';

export default function TableHeader(props) {
    var { name, unitSystem, dataMapping } = props;

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
                { getHeader(unitSystem, column) }
                </th>
            ))
            }
        </tr>
        </thead>
        </Table>
    );
}