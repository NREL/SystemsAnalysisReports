import React from 'react';
import Table from 'react-bootstrap/Table'
import { getUnitLabel } from '../functions/dataFormatting';
import { useTranslation } from "react-i18next";

// function getHeader(unitSystem, column, t) {
//     var header = ""
//     header = t("systemLoadSummary:"+column['displayName'])
//     if (column["type"]) {
//         header += ' [' + getUnitLabel(unitSystem, column["type"]) + ']'
//     }
//
//     return header
// }

export default function TableHeader(props) {
    var { name, unitSystem, dataMapping } = props;
    const { t } = useTranslation();

    const getHeader = (unitSystem, column) => {
        var header = ""
        header = t("systemLoadSummary:"+column['displayName'])
        if (column["type"]) {
            header += ' [' + getUnitLabel(unitSystem, column["type"]) + ']'
        }

        return header
    }

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
                { getHeader(unitSystem, column, t) }
                </th>
            ))
            }
        </tr>
        </thead>
        </Table>
    );
}