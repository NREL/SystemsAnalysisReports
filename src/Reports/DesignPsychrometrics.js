import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { ReportCard } from '../Components/ReportCard';
import { PsychrometricChart } from '../Components/PsychrometricChart';
import { PsychrometricTable } from '../Components/PsychrometricTable';
import { Context } from '../store/index';
import { DesignPsychrometricsPDF } from '../PdfReports/DesignPsychrometricsPDF';
import { getObjectName } from '../functions/dataFormatting';
import { formatDesignPsychrometricsTableData } from '../functions/tableFunctions';
import { useTranslation } from "react-i18next";

function DesignPsychrometrics(props) {
    const {
        name,
        objectSelection,
        handleObjectSelect,
        objectList,
        dataMapping,
        data,
        ns
    } = props;

    const { t } = useTranslation()

    const {
        sectionSelection,
        unitSystem,
        coilId, setCoilId,
        pdfPrint, setPdfPrint,
        animationEnable, setAnimationEnable,
    } = useContext(Context);
    const [ dataExists, setDataExists ] = useState(false);
    const [ modalShow, setModalShow ] = useState(false);
    const [ progressBarValue, setProgressBarValue ] = useState(0);
    const d3Container = useRef(null);

    useEffect(() => {
        if (pdfPrint) {

            // Async function to write report
            async function writePDFReport() {

                // Open progress modal
                setModalShow(true);

                // Get original state
                let setObjectId = setCoilId;
                let origId = coilId;

                // Run function to create report
                await DesignPsychrometricsPDF(
                    unitSystem,
                    sectionSelection,
                    objectList,
                    d3Container,
                    setPdfPrint,
                    setObjectId,
                    setAnimationEnable,
                    setProgressBarValue,
                    dataMapping,
                    data,
                    ns,
                    t
                    )

                // Return to original state
                setModalShow(false);
                setObjectId(origId);
            }

            writePDFReport()
        }
    }, [pdfPrint, sectionSelection]);

    useEffect(() => {
        // Set data_exists state to false if data object is empty
        if (data && Object.keys(data).length === 0) {
            setDataExists(false);
        } else {
            setDataExists(true);
        }
    }, [data]);

    // if (data && Object.keys(data).length !== 0) {
        const objectName = getObjectName(objectList, objectSelection);
        const objectData = data[objectName];

    if (dataExists) {
        const psychTableData = formatDesignPsychrometricsTableData(dataMapping['componentTable'], objectData)
        return (
            <React.Fragment>
                <div className='App-summary-content'  style={{marginLeft: "24px"}}>
                    {objectList ?  <ObjectSelectionDropDown
                        name={name + "-objectDropdown"}
                        objectList={objectList}
                        objectSelection={objectSelection}
                        handleObjectSelect={handleObjectSelect}
                    /> : null }
                    <ReportCard
                        name={name + "-conditionsTimePeak"}
                        title={ t(ns + ":" + "Summary") }
                        unitSystem={unitSystem}
                        dataMapping={dataMapping['componentChecks']}
                        data={objectData["summary"]}
                        ns={ns}
                    />
                </div>
                <div className='App-detailed-content'>
                    <PsychrometricChart
                        d3Container={d3Container}
                        unitSystem={unitSystem}
                        animationEnable={animationEnable}
                        data={objectData}
                        dataMapping={dataMapping['componentTable']}
                        ns={ns}
                    />
                </div>
                {Object.values(psychTableData).some(row => Object.values(row).some(cell => cell !== null)) ? (
                    <div className='App-full-width-content'>
                        <PsychrometricTable
                            name={name + "-statePointTable"}
                            width={932}
                            firstColWidth={150}
                            displayHeader={true}
                            unitSystem={unitSystem}
                            dataMapping={dataMapping['componentTable']}
                            data={psychTableData}
                            ns={ns}
                        />
                    </div>
                ) : (
                    <div className='App-full-width-content'>
                        <p className='App-message'>{t('systemsAnalysisReport:No ideal loads state points found for ' + objectName + '. Coil has likely been hard-sized by an upstream measure.')}</p>
                    </div>
                )}
                <Modal
                    show={modalShow}
                    onHide={(() => setModalShow(false))}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton={false}>
                    </Modal.Header>
                    <Modal.Body>
                    <ProgressBar now={progressBarValue} />
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    } else {
        return (
            <div className='App-full-width-content'>
                <h1>{t(ns + ":" + "No system coils found")}.</h1>
            </div>
        );
    }
}

export default DesignPsychrometrics;