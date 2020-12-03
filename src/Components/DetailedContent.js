import React from 'react';
import { useTranslation } from "react-i18next";
import { CustomTable } from '../Components/Table';
import TableHeader from '../Components/TableHeader';
import { formatLoadSummaryTableData } from '../functions/tableFunctions';
import './DetailedContent.css';

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
                firstColWidth={250}
                unitSystem={unitSystem}
                dataMapping={dataMapping['headerTable']}
                ns={ns}
            />
            <div className="table-section-heading">{t('zoneLoadSummary:Envelope')}</div>
            <CustomTable
                t={t}
                name={name + "-envelopeTable"}
                firstColWidth={250}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['envelopeLoadsTable']}
                data={formatLoadSummaryTableData(dataMapping['envelopeLoadsTable'], loadData)}
                ns={ns}
            />
            <div className="table-section-heading">{t('zoneLoadSummary:Internal Gains')}</div>
            <CustomTable
                t={t}
                name={name + "-internalGainTable"}
                firstColWidth={250}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['internalGainsTable']}
                data={formatLoadSummaryTableData(dataMapping['internalGainsTable'], loadData)}
                ns={ns}
                />
            <div className="table-section-heading">{t('zoneLoadSummary:Systems')}</div>
            <CustomTable
                t={t}
                name={name + "-systemLoadsTable"}
                firstColWidth={250}
                displayHeader={false}
                unitSystem={unitSystem}
                dataMapping={dataMapping['systemLoadsTable']}
                data={formatLoadSummaryTableData(dataMapping['systemLoadsTable'], loadData)}
                ns={ns}
            />
            <div className="table-section-heading">{t('zoneLoadSummary:Total')}</div>
            <CustomTable
                t={t}
                name={name + "-totalLoadsTable"}
                firstColWidth={250}
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

