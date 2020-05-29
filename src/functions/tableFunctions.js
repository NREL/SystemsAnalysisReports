import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';

export const getHeader = (unitSystem, column) => {
    var header = ""
    header = column['displayName']
    if (column["type"]) {
        header += ' [' + getUnitLabel(unitSystem, column["type"]) + ']'
    }

    return header
}