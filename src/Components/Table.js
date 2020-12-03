import React from 'react';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { useTranslation } from "react-i18next";
import "./Table.css"

export function CustomTable(props) {
    var { name, firstColWidth, unitSystem, dataMapping, displayHeader, data, ns } = props;
    const { t } = useTranslation();
    const numberOfCols = Object.entries(dataMapping.columns).length;
    //const firstColWidth = 20;
    const colWidth = (656-firstColWidth)/numberOfCols;

    const addDataRow = (unitSystem, row, columns, data, t) => {
        const rowKey = row['jsonKey'];

        if (data) {
            var rowData = data[rowKey];

            //if (rowData) {
            return (
                <tr key={ name + '-' + rowKey } className="table-row">
                    <td
                        width={`${firstColWidth}px`}
                        className={['subtotal', 'grand_total'].includes(rowKey) ? "table-label-bold table-border-top-bottom" : "table-label-regular table-border-top-bottom"}
                    >
                        { t(ns+":"+row['displayName']) }
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
                                width={`${colWidth}px`}
                                className={['subtotal', 'grand_total'].includes(rowKey) ? "table-value-bold table-border-left table-border-top-bottom" : "table-value-regular table-border-left table-border-top-bottom"}
                            >
                                { dataValue }
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
            header += ' [' + getUnitLabel(unitSystem, column["type"], t) + ']'
        }

        return header
    }

    const headerStyle = displayHeader === true ? null : {"display":"none"};

    return(
        // const { t } = useTranslation();

        <table className="App-table">
            <thead style={headerStyle}>
            <tr key={ name + '-header' }>
                <th  key={ name + '-label-header' } width={`${firstColWidth}px`}></th>
                { dataMapping['columns'].map((column) => (
                    <th
                        key={ name + '-' + column['displayName'] + '-header' }
                        width={`${colWidth}px`}
                    >
                        { getHeader(unitSystem, column, t) }
                    </th>
                ))
                }
            </tr>
            </thead>
            <tbody>
            { dataMapping['rows'].map((row) => addDataRow(unitSystem, row, dataMapping['columns'], data, t)) }
            </tbody>
        </table>
    );
}