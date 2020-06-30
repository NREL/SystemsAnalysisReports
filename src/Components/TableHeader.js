import React from 'react';
import Table from 'react-bootstrap/Table'
import { getHeader } from '../functions/tableFunctions';
import { useTranslation } from "react-i18next";

export default function TableHeader(props) {
    var { name, firstColWidth, unitSystem, dataMapping, ns } = props;
    const { t } = useTranslation();
    const numberOfCols = Object.entries(dataMapping.columns).length;
    const colWidth = (100-firstColWidth)/numberOfCols;

    return (
        <Table striped bordered hover responsive size="sm" className="App-table">
        <thead>
        <tr key={ name + '-header' }>
            <th  key={ name + '-label-header' } width={`${firstColWidth}%`}></th>
            { dataMapping['columns'].map((column) => (
                <th
                key={ name + '-' + column['displayName'] + '-header' }
                width={`${colWidth}%`}
                >
                { getHeader(unitSystem, column, t, ns) }
                </th>
            ))
            }
        </tr>
        </thead>
        </Table>
    );
}