import React, { useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { CustomTable } from '../Components/Table';
import { ReportCard } from '../Components/ReportCard';
import { PsychrometricChart } from '../Components/PsychrometricChart';
import { Context } from '../store/index';
import { DesignPsychrometricsPDF } from '../PdfReports/DesignPsychrometricsPDF';
import { getObjectName } from '../functions/dataFormatting';
import { formatDesignPsychrometricsTableData } from '../functions/tableFunctions';
import { useTranslation } from "react-i18next";

export function DesignPsychrometrics(props) {
    const { 
        name,
        objectSelection,
        handleObjectSelect,
        objectList,
        dataMapping,
        data
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
                console.log('Print pdf report.');

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
                    data
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

    if (data && Object.keys(data).length !== 0) {
        const objectName = getObjectName(objectList, objectSelection);
        const objectData = data[objectName];

        return (
            ( dataExists ?
                <div id={name + '-designpsychrometricreport'}  height="500px" width="50px">
                <Tab.Container id={name + '-container'}>
                    <Row>
                        <Col className='text-left'>
                            <ObjectSelectionDropDown
                            name={name + "-objectDropdown"}
                            objectList={objectList}
                            objectSelection={objectSelection}
                            handleObjectSelect={handleObjectSelect}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={1}>
                            <ReportCard
                            name={name + "-conditionsTimePeak"}
                            title={ t("designPsychrometrics:Summary") }
                            unitSystem={unitSystem}
                            dataMapping={dataMapping['componentChecks']}
                            data={objectData["summary"]}
                            ns={"designPsychrometrics"}
                            />
                        </Col>
                        <Col>
                            <PsychrometricChart
                            d3Container={d3Container}
                            unitSystem={unitSystem}
                            animationEnable={animationEnable}
                            data={objectData}
                            dataMapping={dataMapping['componentTable']}
                            ns={"designPsychrometrics"}
                            />
                        </Col>
                </Row>
                <Row>
                    <Col>
                        <CustomTable
                        name={name + "-statePointTable"}
                        firstColWidth={10}
                        displayHeader={true}
                        unitSystem={unitSystem}
                        dataMapping={dataMapping['componentTable']}
                        data={formatDesignPsychrometricsTableData(dataMapping['componentTable'], objectData)}
                        ns={"designPsychrometrics"}
                        />
                    </Col>
                </Row>
                </Tab.Container>
                <Modal
                    show={modalShow}
                    onHide={(() => setModalShow(false))}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton={false}>
                    <Modal.Title>{"Printing Design Psychrometrics Report to PDF"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <ProgressBar now={progressBarValue} />
                    </Modal.Body>
                </Modal>
                </div>
            : 
                <h1>No system coils found.</h1> 
            )
        );
    }
}