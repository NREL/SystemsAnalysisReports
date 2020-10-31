import React from 'react';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { ReportCard } from '../Components/ReportCard';
import { CustomPieChart } from '../Components/PieChart';
import { Context } from '../store/index';
import { getObjectName, convertDataUnit, getUnitLabel, getHeatingAndCoolingPeakLoads, formatLoadComponentChartData } from '../functions/dataFormatting';

import { 
    EQUIDISTANTCOLORS,
    COOLINGHEATINGCOLORS
} from '../constants/settings';
import { useTranslation } from "react-i18next";

const getPeakConditionTable = (objectName, heatingCoolingSelection, data) => {
    // Get data for peak_condition_table
    if (data && Object.keys(data).length !== 0) {
        if (objectName) {
            return data[objectName][heatingCoolingSelection]['peak_condition']
        } else { 
            return null 
        }
    } else {
        return null
    }
}

const getTemperaturesTable = (objectName, heatingCoolingSelection, data) => {
    // Get data for peak_condition_table
    if (data && Object.keys(data).length !== 0) {
        if (objectName) {
            return data[objectName][heatingCoolingSelection]['temperature']
        } else { 
            return null 
        }
    } else {
        return null
    }
}

const getAirflowsTable = (objectName, heatingCoolingSelection, data) => {
    // Get data for peak_condition_table
    if (data && Object.keys(data).length !== 0) {
        if (objectName) {
            return data[objectName][heatingCoolingSelection]['airflow']
        } else { 
            return null
        }
    } else {
        return null
    }
}

const getEngineeringCheckTable = (objectName, heatingCoolingSelection, data) => {
    // Get data for engineering_check_table
    if (data && Object.keys(data).length !== 0) {  
        if (objectName) {
            return data[objectName][heatingCoolingSelection]['engineering_check']
        } else { 
            return null 
        }
    } else {
        return null
    }
}

const SummaryContent = (props) => {
    const { t } = useTranslation();
    const {
        name,
        unitSystem,
        objectName,
        objectList,
        activeSelection,
        heatingCoolingSelection,
        handleObjectSelect,
        chart1Ref,
        chart2Ref,
        dataMapping,
        data,
        loadData,
        ns
    } = props;

    // dataMapping is not working properly.

    return (
        <React.Fragment>
            <ReportCard
                name={name + "-conditionsTimePeak"}
                title={t("systemLoadSummary:Conditions at Time of Peak")}
                unitSystem={unitSystem}
                dataMapping={dataMapping['peakConditions']}
                data={getPeakConditionTable(objectName, heatingCoolingSelection, data)}
                ns={ns}
                />
            { name === 'systemLoadSummary' ? (
                <ReportCard
                name={name + "-temperatures"}
                title={t(ns+":Temperatures")}
                unitSystem={unitSystem}
                dataMapping={dataMapping['temperatures']}
                data={getTemperaturesTable(objectName, heatingCoolingSelection, data)}
                ns={ns}
                />
            ) : null }
            { name === 'systemLoadSummary' ? (
                <ReportCard
                name={name + "-airflows"}
                title={t(ns+":Airflows")}
                unitSystem={unitSystem}
                dataMapping={dataMapping['airflows']}
                data={getAirflowsTable(objectName, heatingCoolingSelection, data)}
                ns={ns}
                />
            ) : null }
                <ReportCard
                name={name + "-engineeringCheck"}
                title={t("systemLoadSummary:Engineering Checks")}
                unitSystem={unitSystem}
                dataMapping={dataMapping['engineeringCheck']}
                data={getEngineeringCheckTable(objectName, heatingCoolingSelection, data)}
                ns={ns}
                />
                <CustomPieChart
                name={name + "-peakLoadsChart"}
                pdfRef={chart1Ref}
                title={t(ns+":"+"Peak Loads")+" [" + getUnitLabel(unitSystem, "heat_transfer_rate", t) + "]"}
                colors={COOLINGHEATINGCOLORS}
                data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                ns={ns}
                />
                <CustomPieChart
                name={name + "-loadComponentsChart"}
                pdfRef={chart2Ref}
                title={ t(ns+":"+(heatingCoolingSelection === "cooling" ? "Cooling" : "Heating") + " Load Components") + " [" + getUnitLabel(unitSystem, "heat_transfer_rate", t) + "]"}
                colors={EQUIDISTANTCOLORS}
                data={formatLoadComponentChartData(unitSystem, dataMapping["componentPieChart"], loadData)}
                ns={ns}
                />
        </React.Fragment>
    )
}

export default SummaryContent

