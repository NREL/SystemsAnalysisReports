import { getUnitLabel } from './dataFormatting';

export const getHeader = (unitSystem, column, t, ns) => {
    var header = ""

    if (t && ns) {
        header = t(ns + ':' + column['displayName']);
    } else {
        header = column['displayName'];
    }

    if (column["type"]) {
        header += ' [' + getUnitLabel(unitSystem, column["type"], t) + ']'
    }

    return header
}

export const formatLoadSummaryTableData = (dataMapping, data) => {
    // This function formats the data that will be displayed in the table.
    if (data) {
        var newData = JSON.parse(JSON.stringify(data));
        var totals = {
            "latent": 0.0,
            "sensible_delayed": 0.0,
            "sensible_instant": 0.0,
            "total": 0.0,
            "percent_grand_total": 0.0
        };

        // Loop and calculate the table subtotals for each column
        if (newData) {
            dataMapping['rows'].map((row) => {
                Object.keys(totals
                    ).map((colName) => {
                    var rowName = row['jsonKey'];
                    if (Object.keys(newData).includes(rowName) && rowName !== "total" && newData[rowName]) {
                        totals[colName] += newData[rowName][colName]
                    }
                    return totals
                })
                return totals
            });

            // Add total row to the data object
            newData["subtotal"] = totals;
        }

        return newData
    } else {
        return null
    }
}

export const formatDesignPsychrometricsTableData = (dataMapping, data) => {
    // This function formats the data that will be displayed in the table.
    if(data) {
        var newData = {};

        // Loop for each row
        dataMapping['rows'].map((row) => {
            var rowKey = row['jsonKey'];
            newData[rowKey] = {};

            // Loop for each column
            dataMapping['columns'].map((column) => {
                var colKey = column['jsonKey'];
                if (data[rowKey] !== null) {
                    newData[rowKey][colKey] = data[rowKey][colKey];
                    return newData
                } else {
                    newData[rowKey][colKey] = null;
                }
            })

            return newData
        })

        return newData
    } else {
        return null
    }
}
