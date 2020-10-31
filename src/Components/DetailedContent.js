import React from 'react';
import { useTranslation } from "react-i18next";
import { CustomTable } from '../Components/Table';
import TableHeader from '../Components/TableHeader';
import { formatLoadSummaryTableData } from '../functions/tableFunctions';

const DetailedContent = (props) => {
    const { t } = useTranslation();
    const {
        name,
        unitSystem,
        dataMapping,
        loadData,
        ns
    } = props;

    return (
        <React.Fragment>
            <TableHeader
                name={name + "-headerTable"}
                firstColWidth={20}
                unitSystem={unitSystem}
                dataMapping={dataMapping['headerTable']}
                ns={ns}
            />
            <span>{t('zoneLoadSummary:Envelope')}</span>
            <CustomTable
                t={t}
                name={name + "-envelopeTable"}
                firstColWidth={20}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['envelopeLoadsTable']}
                data={formatLoadSummaryTableData(dataMapping['envelopeLoadsTable'], loadData)}
                ns={ns}
            />
            <span>{t('zoneLoadSummary:Internal Gains')}</span>
            <CustomTable
                t={t}
                name={name + "-internalGainTable"}
                firstColWidth={20}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['internalGainsTable']}
                data={formatLoadSummaryTableData(dataMapping['internalGainsTable'], loadData)}
                ns={ns}
                />
            <span>{t('zoneLoadSummary:Systems')}</span>
            <CustomTable
                t={t}
                name={name + "-systemLoadsTable"}
                firstColWidth={20}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['systemLoadsTable']}
                data={formatLoadSummaryTableData(dataMapping['systemLoadsTable'], loadData)}
                ns={ns}
            />
            <span>{t('zoneLoadSummary:Total')}</span>
            <CustomTable
                t={t}
                name={name + "-totalLoadsTable"}
                firstColWidth={20}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['totalLoadsTable']}
                data={formatLoadSummaryTableData(dataMapping['totalLoadsTable'], loadData)}
                ns={ns}
            />
        </React.Fragment>
    )
}

export default DetailedContent

