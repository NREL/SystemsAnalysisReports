import React from 'react';
import Table from 'react-bootstrap/Table'
import { getUnitLabel } from '../functions/dataFormatting';
import { useTranslation } from "react-i18next";

export default function TableHeader(props) {
    var { name, firstColWidth, unitSystem, dataMapping } = props;
    const { t } = useTranslation();
    const numberOfCols = Object.entries(dataMapping.columns).length;
    //const firstColWidth = 20;
    const colWidth = (100-firstColWidth)/numberOfCols;

    const getHeader = (unitSystem, column, t) => {
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
            <th  key={ name + '-label-header' } width={`${firstColWidth}%`}></th>
            { dataMapping['columns'].map((column) => (
                <th
                key={ name + '-' + column['displayName'] + '-header' }
                width={`${colWidth}%`}
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