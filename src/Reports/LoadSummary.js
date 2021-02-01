import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SummaryContent from '../Components/SummaryContent';
import DetailedContent from '../Components/DetailedContent';
import { ObjectSelectionDropDown } from '../Components/ObjectSelectionDropdown';
import { Context } from '../store/index';
import {getHeatingAndCoolingPeakLoads, getObjectName, getUnitLabel} from '../functions/dataFormatting';
import { LoadSummaryPDF } from '../PdfReports/LoadSummaryPDF';
import { useTranslation } from "react-i18next";
import './LoadSummary.css';
import {render} from "@testing-library/react";
import {COOLINGHEATINGCOLORS} from "../constants/settings";
import {CustomPieChart} from "../Components/PieChart";

function LoadSummary(props) {
    const { 
        name,
        activeSelection,
        handleObjectSelect,
        objectList,
        dataMapping,
        data,
        ns
    } = props;
    
    const { 
        sectionSelection, 
        unitSystem, 
        zoneId, setZoneId,
        systemId, setSystemId,
        pdfPrint, setPdfPrint,
        setAnimationEnable,
    } = useContext(Context);
    const [ heatingCoolingSelection, setHeatingCoolingSelection ] = useState("cooling");
    const [ modalShow, setModalShow ] = useState(false);
    const [ progressBarValue, setProgressBarValue ] = useState(0);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (pdfPrint) {

            async function writePDFReport() {

                // Open progress modal
                setModalShow(true);

                // Get original state
                let setObjectId = null;
                let origId = null;
                if (sectionSelection==='zone_load_summary') {
                    setObjectId = setZoneId;
                    origId = zoneId;
                } else if (sectionSelection==='system_load_summary') {
                    setObjectId = setSystemId;
                    origId = systemId;
                }

                let origHeatingCoolingSelection = heatingCoolingSelection;
                
                // Run function to create report
                await LoadSummaryPDF(
                    unitSystem,
                    sectionSelection,
                    objectList,
                    chart1Ref,
                    chart2Ref,
                    setPdfPrint,
                    setObjectId,
                    setHeatingCoolingSelection,
                    setAnimationEnable,
                    setProgressBarValue,
                    dataMapping,
                    data,
                    ns,
                    t
                    )
                
                // Return to original state
                setModalShow(false);
                // setObjectId(origId);
                // setHeatingCoolingSelection(origHeatingCoolingSelection);
            }
            
            writePDFReport()
        }
    }, [pdfPrint, sectionSelection]);

    const handleHeatingCoolingSelect = (eventKey) => {
        // Update state when user selects either "heating" or "cooling"
        if (eventKey === "heating") {
            setHeatingCoolingSelection("heating");
        } else {
            setHeatingCoolingSelection("cooling");          
        }
    }

    const getLoadComponents = (objectName, heatingCoolingSelection, data) => {
        // Get data for peak_load_component_table
        if (data && Object.keys(data).length !== 0) {
            if (objectName) {
                return data[objectName][heatingCoolingSelection]['estimated_peak_load_component_table']
            } else { 
                return null 
            }
        } else {
            return null
        }
    }

    if (data && Object.keys(data).length !== 0) {
        const objectName = getObjectName(objectList,activeSelection);
        const loadData = getLoadComponents(objectName, heatingCoolingSelection, data);

        return (
                <React.Fragment>
                    <div id='test_id' style={{width:0, height:0, overflow:"hidden"}}>
                        {
                            function() {
                                var items = []
                                const heatingCoolingOptions = ['cooling', 'heating'];

                                for (var j = 0; j < heatingCoolingOptions.length; j++) {
                                    const heatingCoolingSelection = heatingCoolingOptions[j];

                                    for (var i = 0; i < objectList.length; i++) {
                                        const objectName = getObjectName(objectList, i);
                                        items.push(
                                            <CustomPieChart
                                                name={name + "-peakLoadsChart"}
                                                title={t(ns+":"+"Peak Loads")+" [" + getUnitLabel(unitSystem, "heat_transfer_rate", t) + "]"}
                                                colors={COOLINGHEATINGCOLORS}
                                                data={getHeatingAndCoolingPeakLoads(unitSystem, objectName, data)}
                                                ns={ns}
                                                id={objectName + "-peakLoadsChart"}
                                            />
                                        )
                                    }
                                }

                                return items
                            }()
                        }
                    </div>
                    <div className='App-summary-content' style={{marginLeft: "24px"}}>
                        {objectList ? <ObjectSelectionDropDown
                            name={name + "-objectDropdown"}
                            objectList={objectList}
                            objectSelection={activeSelection}
                            handleObjectSelect={handleObjectSelect}
                        /> : null}
                        <SummaryContent
                            name={name}
                            unitSystem={unitSystem}
                            objectName={objectName}
                            objectList={objectList}
                            activeSelection={activeSelection}
                            heatingCoolingSelection={heatingCoolingSelection}
                            handleObjectSelect={handleObjectSelect}
                            chart1Ref={chart1Ref}
                            chart2Ref={chart2Ref}
                            dataMapping={dataMapping}
                            data={data}
                            loadData={loadData}
                            ns={ns}
                        />
                    </div>
                    <div className='App-detailed-content'>
                        <div className="heating-cooling-button-group">
                            <button
                                onClick={() => handleHeatingCoolingSelect('cooling')}
                                className={
                                    heatingCoolingSelection == 'cooling' ? "heating-cooling-button-active" : "heating-cooling-button-inactive"
                                  }
                                style={{"border-top-left-radius": "3px", "border-bottom-left-radius": "3px"}}
                            >{t('zoneLoadSummary:Cooling')}</button>
                            <button
                                onClick={() => handleHeatingCoolingSelect('heating')}
                                className={
                                    heatingCoolingSelection == 'heating' ? "heating-cooling-button-active" : "heating-cooling-button-inactive"
                                  }
                                style={{"border-top-right-radius": "3px", "border-bottom-right-radius": "3px"}}
                            >{t('zoneLoadSummary:Heating')}</button>
                        </div>
                        <DetailedContent
                            name={name}
                            unitSystem={unitSystem}
                            dataMapping={dataMapping}
                            loadData={loadData}
                            ns={ns}
                        />
                    </div>
                    <Modal
                        show={modalShow}
                        onHide={(() => setModalShow(false))}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton={false}>
                        {/*<Modal.Title>{sectionSelection === "zone_load_summary" ? "Printing Zone Load Summary Report to PDF": "Printing System Load Summary Report to PDF" }</Modal.Title>*/}
                        </Modal.Header>
                        <Modal.Body>
                        <ProgressBar now={progressBarValue} />
                        </Modal.Body>
                    </Modal>
                </React.Fragment>
        );
    } else {
        return(
            <div className='App-full-width-content'>
                <h1>{t(ns + ":No " + (name === 'zoneLoadSummary' ? 'zones': 'systems') + " found")}.</h1>
            </div>
        )
    }
}

export default LoadSummary;