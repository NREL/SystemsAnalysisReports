import React from 'react';
import Table from 'react-bootstrap/Table'
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { useTranslation } from "react-i18next";

export function CustomTable(props) {
    var { name, unitSystem, dataMapping, displayHeader, data, ns } = props;
    const { t } = useTranslation();

    const addDataRow = (unitSystem, row, columns, data, t) => {
        const rowKey = row['jsonKey'];

        if (data) {
            var rowData = data[rowKey];

            //if (rowData) {
            return (
                <tr key={ name + '-' + rowKey }>
                    <td width="25%">
                        { ( ['subtotal', 'grand_total'].includes(rowKey) ? <i>{t(ns+":"+row['displayName'])}</i> : t(ns+":"+row['displayName'])) }
                    </td>
                    { columns.map((column) => {
                        var dataValue = null;

                        if (rowData) {
                            if (Object.keys(rowData).includes(column['jsonKey'])) {
                                if ( isNumeric(rowData[column['jsonKey']]) ) {
                                    const type = column["type"];

                                    // convert unit system
                                    dataValue = convertDataUnit(unitSystem, type, rowData[column['jsonKey']])

                                    // Set value to display as number with commas
                                    dataValue = numberWithCommas(dataValue);

                                } else {
                                    // Set value to null if none exists in data
                                    dataValue = '-';
                                }
                            }
                        } else {
                            dataValue = '-'
                        }

                        return (
                            <td
                                key={ name + '-' + rowKey + '-' + column['jsonKey'] }
                                width="15%"
                            >
                                {  ['subtotal', 'grand_total'].includes(rowKey) ? <i>{dataValue}</i> : dataValue }
                            </td>
                        )

                    })}
                </tr>
            );
            //}
        }
    }

    const getHeader = (unitSystem, column) => {
        var header = ""
        header = t(ns+":"+column['displayName'])
        if (column["type"]) {
            header += ' [' + getUnitLabel(unitSystem, column["type"]) + ']'
        }

        return header
    }

    const headerStyle = displayHeader === true ? null : {"display":"none"};

    return(
        // const { t } = useTranslation();

        <Table striped bordered hover responsive size="sm" className="App-table">
            <thead style={headerStyle}>
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
            <tbody>
            { dataMapping['rows'].map((row) => addDataRow(unitSystem, row, dataMapping['columns'], data, t)) }
            </tbody>
        </Table>
    );
}