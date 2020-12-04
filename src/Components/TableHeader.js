import React from 'react';
import { getHeader } from '../functions/tableFunctions';
import { useTranslation } from "react-i18next";
import './Table.css';

export default function TableHeader(props) {
    var { name, width, firstColWidth, unitSystem, dataMapping, ns } = props;
    const { t } = useTranslation();
    const numberOfCols = Object.entries(dataMapping.columns).length;
    const colWidth = (width-firstColWidth)/numberOfCols;

    return (
        <table className="App-table">
        <thead>
        <tr key={ name + '-header' } className="table-header-row">
            <th
                key={ name + '-label-header' }
                width={`${firstColWidth}px`}
                className='table-header'
            ></th>
            { dataMapping['columns'].map((column) => (
                <th
                key={ name + '-' + column['displayName'] + '-header' }
                width={`${colWidth}px`}
                className='table-header table-border-left'
                >
                { getHeader(unitSystem, column, t, ns) }
                </th>
            ))
            }
        </tr>
        </thead>
        </table>
    );
}