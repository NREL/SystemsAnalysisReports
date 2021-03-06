import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//import { useTranslation } from "react-i18next";
import { getHeader } from '../functions/tableFunctions';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatLoadSummaryTableData } from '../functions/tableFunctions';
import '../../public/fonts/jsPDF/ArtifaktElement-normal'
import '../../public/fonts/jsPDF/ArtifaktElement-bold'

export const LoadSummaryPDF = async (
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
    ) => {
    var startTime = new Date().getTime();
    //const { t } = useTranslation();
    
    // Set title for report
    var pageTitle = null;
    if (sectionSelection==='zone_load_summary') {
        pageTitle = t(ns+":"+'Zone Load Summary');
    }  else if (sectionSelection==='system_load_summary') {
        pageTitle = t(ns+":"+'System Load Summary');
    } else {
        pageTitle = '';
    }

    const cardFontSize = 6;
    const tableBodyStyle = { fontStyle: 'normal', fontSize: 8, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}
    const tableHeaderStyle =  { fontStyle: 'normal', fontSize: 8, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, halign: 'center', fillColor: '#E5E5E5' };
    const columnStyles = {
        sensible_instant: {cellWidth: 35, halign: 'center' },
        sensible_delayed: {cellWidth: 35, halign: 'center' },
        latent: {cellWidth: 22, halign: 'center' },
        total: {cellWidth: 22, halign: 'center' },
        percent_grand_total: {cellWidth: 35, halign: 'center' }
    };
    const tableSubHeaderSize = 8;
    const tableSubHeaderMargin = 2;

    // Default a4 size (210 x 297 mm), units in mm
    const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});
    doc.setFont('Artifakt Element')
    const baseFont = doc.getFont()['fontName'];

    // Turn off animations
    setAnimationEnable(false);

    var pageNum = 1;
    const heatingCoolingOptions = ['cooling', 'heating'];
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length * heatingCoolingOptions.length;

    // Initialize progress bar
    setProgressBarValue(progressBarValue);

    // Render all charts prior to looping through all the data

    for (var j = 0; j < heatingCoolingOptions.length; j++) {
        const heatingCoolingSelection = heatingCoolingOptions[j];

        for (var i = 0; i < objectList.length; i++) {
            var xStart = 0;
            var yStart = 0;
            
            // Set object for loop
            const objectId = i;
            setObjectId(i);
            setHeatingCoolingSelection(heatingCoolingSelection);
            const objectName = getObjectName(objectList, objectId);

            // Add page, if necessary
            if (!((i===0) && (j===0))) {
                pageNum++; // Increment page number
                doc.addPage()
            }

            // Title
            doc.setFontSize(14);
            doc.setFont(baseFont, "bold")
            doc.text(pageTitle, 5, 10);

            const pageTitleWidth = doc.getStringUnitWidth(pageTitle)*14*25.4/72
            // Vertical Line
            let xStartLine = 5 + pageTitleWidth + 5
            doc.setDrawColor("#EEEEEE")
            doc.setLineWidth(0.025)
            doc.line(xStartLine, 6, xStartLine, 11)

            // Object Name
            xStart = 5 + pageTitleWidth + 10;
            yStart = 10;
            const objectNameWidth = doc.getStringUnitWidth(objectName)*10*25.4/72;
            doc.setDrawColor(0);
            doc.setFillColor(108, 118, 126);
            doc.rect(xStart-1, yStart-4, objectNameWidth+2, 5, 'F');
            doc.setTextColor(255,255,255);
            doc.setFontSize(10);
            doc.setFont(baseFont, "normal");
            doc.text(objectName, xStart, yStart);

            // Cooling/Heating Label
            xStart += objectNameWidth + 5;  // Place label next to the object name label
            yStart = 10;

            if(heatingCoolingSelection === 'cooling'){
                const conditionType = t(ns+":"+'Cooling').toUpperCase()
                const conditionTypeLen = doc.getStringUnitWidth(conditionType)*10*25.4/72;
                doc.setDrawColor(0);
                doc.setFillColor(67, 116, 186);
                doc.rect(xStart, yStart-4, conditionTypeLen + 2, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text(conditionType, xStart+1, yStart);
            } else if (heatingCoolingSelection === 'heating') {
                const conditionType = t(ns+":"+'Heating').toUpperCase()
                const conditionTypeLen = doc.getStringUnitWidth(conditionType)*10*25.4/72;
                doc.setDrawColor(0);
                doc.setFillColor(220, 53, 69);
                doc.rect(xStart, yStart-4, conditionTypeLen + 2, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text(conditionType, xStart + 1, yStart);
            }

            // Horizontal Line
            xStartLine = 5
            doc.setDrawColor("#EEEEEE")
            doc.setLineWidth(0.025)
            doc.line(xStartLine, 13, 205, 13)

            // Write Peak Conditions
            xStart = 5;
            yStart = 10+6;

            const peakConditionsData = data[objectName][heatingCoolingSelection]['peak_condition'];
            let cardText = formatCardText(unitSystem, dataMapping['peakConditions'][0], peakConditionsData, t, ns);
            let label = t(ns + ':' + 'Conditions at Time of Peak').toUpperCase()
            let labelLen = doc.getStringUnitWidth(label)*7*25.4/72;
            let col1Width = 55;
            doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(xStart, yStart, col1Width, 5, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFont(baseFont, "bold");
            doc.setFontSize(7);
            doc.text(label, xStart + 2, yStart+3.5);
            doc.setFont(baseFont, "normal");
            doc.setFontSize(cardFontSize);
            doc.text(cardText, xStart + 2, yStart+9);
            //
            // // Write Outside Conditions
            xStart = 7;
            yStart = 29;

            doc.setFont(baseFont, "bold");
            label = t(ns + ':' + dataMapping['peakConditions'][1]['label'])
            labelLen = doc.getStringUnitWidth(label)*7*25.4/72;
            doc.text(label, xStart, yStart);
            // cardText = formatCardText(unitSystem, dataMapping['peakConditions'][1], peakConditionsData, t, ns);
            // doc.setFont(baseFont, "normal");
            // doc.setFontSize(cardFontSize);
            // doc.text(cardText, xStart + 1.5, yStart+3);

            let mapKey = 'peakConditions';
            let tableData = dataToRows(unitSystem, dataMapping[mapKey][1], peakConditionsData, t, ns);
            const dataTableBodyStyle = { fontStyle: 'normal', fontSize: 6, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}

            let keyColWidth = getLongestString(doc, tableData, dataTableBodyStyle['fontSize']);
            let valColWidth = 15;
            let tableWidth = keyColWidth + valColWidth;

            let dataColumnStyles = {
                key: { halign: 'left', cellWidth: keyColWidth },
                value: { halign: 'left', fontStyle:'bold' , cellWidth: valColWidth, valign: 'bottom'}
            };

            doc.autoTable({
                margin: 8.5,
                tableLineWidth: 0,
                theme: 'plain',
                bodyStyles: dataTableBodyStyle,
                columnStyles: dataColumnStyles,
                body: tableData,
                columns: [{header: '', dataKey: 'key'}, {header: '', dataKey: 'value'}],
                showHead: 'never',
                startY: yStart,
                tableWidth: tableWidth,
                styles: {
                    cellPadding: {top: 0, right: 0, bottom: 0, left: 0},
                    font: "Artifakt Element"
                }
            });

            // Write Zone Conditions
            if (sectionSelection==='zone_load_summary') {
                xStart = 7;
                yStart = 41;

                doc.setFont(baseFont, "bold");
                doc.text(t(ns + ':' + dataMapping['peakConditions'][2]['label']), xStart, yStart);
                // cardText = formatCardText(unitSystem, dataMapping['peakConditions'][2], peakConditionsData, t, ns);
                // doc.setFont(baseFont, "normal");
                // doc.setFontSize(cardFontSize);
                // doc.text(cardText, xStart + 1.5, yStart+3);

                let mapKey = 'peakConditions';
                let tableData = dataToRows(unitSystem, dataMapping[mapKey][2], peakConditionsData, t, ns);
                const dataTableBodyStyle = { fontStyle: 'normal', fontSize: 6, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}

                let keyColWidth = getLongestString(doc, tableData, dataTableBodyStyle['fontSize']);
                const valColWidth = 15;
                let tableWidth = keyColWidth + valColWidth;

                const dataColumnStyles = {
                    key: { halign: 'left', cellWidth: keyColWidth },
                    value: { halign: 'left', fontStyle:'bold' , cellWidth: valColWidth, valign: 'bottom'}
                };

                doc.autoTable({
                    margin: 8.5,
                    tableLineWidth: 0,
                    theme: 'plain',
                    bodyStyles: dataTableBodyStyle,
                    columnStyles: dataColumnStyles,
                    body: tableData,
                    columns: [{header: '', dataKey: 'key'}, {header: '', dataKey: 'value'}],
                    showHead: 'never',
                    startY: yStart,
                    tableWidth: tableWidth,
                    styles: {
                        cellPadding: {top: 0, right: 0, bottom: 0, left: 0},
                        font: "Artifakt Element"
                    }
                });
            }

            // Write Temperatures
            if (sectionSelection==='system_load_summary') {
                xStart = 5;
                yStart = 41;
                let rectWidth = 55;

                label = t(ns + ':' + 'Temperatures').toUpperCase()
                labelLen = doc.getStringUnitWidth(label)*7*25.4/72;
                doc.setDrawColor(0);
                doc.setFillColor(221, 221, 221);
                doc.rect(xStart, yStart, rectWidth, 5, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFont(baseFont, "bold");
                doc.setFontSize(cardFontSize+1);
                doc.text(label, xStart + 2, yStart+3.5);

                mapKey = 'temperatures';
                const temperatureData = data[objectName][heatingCoolingSelection]['temperature'];
                tableData = dataToRows(unitSystem, dataMapping[mapKey][0], temperatureData, t, ns);
                const dataTableBodyStyle = { fontStyle: 'normal', fontSize: 6, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}

                let keyColWidth = getLongestString(doc, tableData, dataTableBodyStyle['fontSize']);
                const valColWidth = 15;
                let tableWidth = keyColWidth + valColWidth;

                const dataColumnStyles = {
                    key: { halign: 'left', cellWidth: keyColWidth },
                    value: { halign: 'left', fontStyle:'bold' , cellWidth: valColWidth, valign: 'bottom'}
                };

                doc.autoTable({
                    margin: 8.5,
                    tableLineWidth: 0,
                    theme: 'plain',
                    bodyStyles: dataTableBodyStyle,
                    columnStyles: dataColumnStyles,
                    body: tableData,
                    columns: [{header: '', dataKey: 'key'}, {header: '', dataKey: 'value'}],
                    showHead: 'never',
                    startY: yStart+6,
                    tableWidth: tableWidth,
                    styles: {
                        cellPadding: {top: 0, right: 0, bottom: 0, left: 0},
                        font: "Artifakt Element"
                    }
                });
            }

            // Write Airflows
            if (sectionSelection==='system_load_summary') {
                xStart = col1Width + 9;
                yStart = 10+6;

                label = t(ns + ':' + 'Airflows').toUpperCase()
                const airflowData = data[objectName][heatingCoolingSelection]['airflow'];
                // cardText = formatCardText(unitSystem, dataMapping['airflows'][0], airflowData, t, ns);
                doc.setDrawColor(0);
                doc.setFillColor(221, 221, 221);
                doc.rect(xStart, yStart, 60, 5, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFont(baseFont, "bold");
                doc.setFontSize(cardFontSize+1);
                doc.text(label, xStart + 2, yStart+3.5);
                // doc.setFont(baseFont, "normal");
                // doc.setFontSize(cardFontSize);
                // doc.text(cardText, xStart + 2, yStart+9);

                mapKey = 'airflows';
                tableData = dataToRows(unitSystem, dataMapping[mapKey][0], airflowData, t, ns);
                const dataTableBodyStyle = { fontStyle: 'normal', fontSize: 6, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}

                let keyColWidth = getLongestString(doc, tableData, dataTableBodyStyle['fontSize']);
                const valColWidth = 15;
                let tableWidth = keyColWidth + valColWidth;

                const dataColumnStyles = {
                    key: { halign: 'left', cellWidth: keyColWidth },
                    value: { halign: 'left', fontStyle:'bold' , cellWidth: valColWidth, valign: 'bottom'}
                };

                doc.autoTable({
                    margin: xStart + 3.5,
                    tableLineWidth: 0,
                    theme: 'plain',
                    bodyStyles: dataTableBodyStyle,
                    columnStyles: dataColumnStyles,
                    body: tableData,
                    columns: [{header: '', dataKey: 'key'}, {header: '', dataKey: 'value'}],
                    showHead: 'never',
                    startY: yStart+6,
                    tableWidth: tableWidth,
                    styles: {
                        cellPadding: {top: 0, right: 0, bottom: 0, left: 0},
                        font: "Artifakt Element"
                    }
                });
            }

            // Write Engineering Checks
            if (sectionSelection==='zone_load_summary') {
                xStart = col1Width + 9;
                yStart = 10+6;
            } else if (sectionSelection==='system_load_summary') {
                xStart = col1Width + 9;
                yStart = 10+21;
            }

            const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
            // cardText = formatCardText(unitSystem, dataMapping['engineeringCheck'][0], engineeringCheckData, t, ns);
            doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(xStart, yStart, 60, 5, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFont(baseFont, "bold");
            doc.setFontSize(cardFontSize+1);
            doc.text(t(ns + ':' + 'Engineering Checks').toUpperCase(), xStart + 2, yStart+3.5);
            // doc.setFont(baseFont, "normal");
            // doc.setFontSize(cardFontSize);
            // doc.text(cardText, xStart+2, yStart+9);

            mapKey = 'engineeringCheck';
            tableData = dataToRows(unitSystem, dataMapping[mapKey][0], engineeringCheckData, t, ns);

            keyColWidth = getLongestString(doc, tableData, dataTableBodyStyle['fontSize']);

            tableWidth = keyColWidth + valColWidth;

            valColWidth = 20;
            dataColumnStyles = {
                key: { halign: 'left', cellWidth: keyColWidth },
                value: { halign: 'left', fontStyle:'bold' , cellWidth: valColWidth, valign: 'bottom'}
            };

            doc.autoTable({
                margin: xStart + 3.5,
                tableLineWidth: 0,
                theme: 'plain',
                bodyStyles: dataTableBodyStyle,
                columnStyles: dataColumnStyles,
                body: tableData,
                columns: [{header: '', dataKey: 'key'}, {header: '', dataKey: 'value'}],
                showHead: 'never',
                startY: yStart+6,
                tableWidth: tableWidth,
                styles: {
                    cellPadding: {top: 0, right: 0, bottom: 0, left: 0},
                    font: "Artifakt Element"
                }
            });

            // Write Heating/Cooling Load Chart
            yStart = 15;

            let svg = ReactDOM.findDOMNode(chart1Ref.current);
            let width = svg.getBoundingClientRect().width;
            let height = svg.getBoundingClientRect().height;

            await domtoimage.toJpeg(svg, {
                width: width,
                height: height,
                style: {
                'transform': 'scale(1.0)',
                'transform-origin': 'top left'
                }
            })
            .then(function (dataUrl) {
                doc.addImage(dataUrl, 'JPEG', 120, yStart, width/5.8, height/5.8, null,'NONE');
            })
            .catch(function (error) {
                console.error('Chart 1 did not render properly.', error);
            });

            // Write Component Load Chart
            svg = ReactDOM.findDOMNode(chart2Ref.current);
            width = svg.getBoundingClientRect().width;
            height = svg.getBoundingClientRect().height;

            await domtoimage.toJpeg(svg, {
                width: width,
                height: height,
                style: {
                'transform': 'scale(1.0)',
                'transform-origin': 'top left'
                }
            })
            .then(function (dataUrl) {
                doc.addImage(dataUrl, 'JPEG', 160, yStart, width/5.8, height/5.8,null,'NONE');
            })
            .catch(function (error) {
                console.error('Chart 2 did not render properly.', error);
            });

            // Load Components Table
            const loadComponentsData = data[objectName][heatingCoolingSelection]['estimated_peak_load_component_table'];

            //Table Header
            yStart = 59;
            mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);

            doc.autoTable({
                margin: 5,
                bodyStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                alternateRowStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                headStyles: tableHeaderStyle,
                columnStyles: columnStyles,
                body: [{name: null, sensible_instant: null, sensible_delayed: null, latent: null, total: null, percent_grand_total: null}],
                columns: colLabels,
                startY: yStart+tableSubHeaderMargin,
                styles: {
                    cellPadding: {top: 1, right: 0, bottom: 1, left: 0},
                    font: "Artifakt Element"
                }
            })

            // Envelope Loads Table
            let finalY = doc.lastAutoTable.finalY
            yStart = finalY - 2;
            doc.setFont(baseFont, "bold");
            doc.setFontSize(tableSubHeaderSize);
            doc.text(t(ns + ':' + 'Envelope'), 6, yStart);


            mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            var tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            doc.autoTable({
                margin: 5,
                tableLineWidth: 0,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart + tableSubHeaderMargin,
                styles: {
                    cellPadding: {top: 1, right: 0, bottom: 1, left: 5},
                    font: "Artifakt Element"
                },
                didParseCell: function (data) {
                    var rows = data.table.body;
                    if (data.row.index === rows.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        if (data.column.index === 0) {
                            data.cell.styles.halign = "right";
                        }
                    }
                }
            })


            // Internal Gains Table
            finalY = doc.lastAutoTable.finalY
            yStart = finalY + 5;
            doc.setFont(baseFont, "bold");
            doc.setFontSize(tableSubHeaderSize);
            doc.text(t(ns + ':' + 'Internal Gains'), 6, yStart);
            mapKey = 'internalGainsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            doc.autoTable({
                margin: 5,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart + tableSubHeaderMargin,
                styles: {
                    cellPadding: {top: 1, right: 0, bottom: 1, left: 5},
                    font: "Artifakt Element"
                },
                didParseCell: function (data) {
                    var rows = data.table.body;
                    if (data.row.index === rows.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        if (data.column.index === 0) {
                            data.cell.styles.halign = "right";
                        }
                    }
                }
            })


            // System Loads Table
            finalY = doc.lastAutoTable.finalY
            yStart = finalY + 5;
            doc.setFontSize(tableSubHeaderSize);
            doc.text(t(ns + ':' + 'Systems'), 6, yStart);
            mapKey = 'systemLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            doc.autoTable({
                margin: 5,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
                styles: {
                    cellPadding: {top: 1, right: 0, bottom: 1, left: 5},
                    font: "Artifakt Element"
                },
                didParseCell: function (data) {
                    var rows = data.table.body;
                    if (data.row.index === rows.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        if (data.column.index === 0) {
                            data.cell.styles.halign = "right";
                        }
                    }
                }
            })

            finalY = doc.lastAutoTable.finalY
            yStart = finalY + 5;
            doc.setFontSize(tableSubHeaderSize);
            doc.text(t(ns + ':' + 'Total'), 6, yStart);
            mapKey = 'totalLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            doc.autoTable({
                margin: 5,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
                styles: {
                    cellPadding: {top: 1, right: 0, bottom: 1, left: 5},
                    font: "Artifakt Element"
                },
                didParseCell: function (data) {
                    var rows = data.table.body;
                    if (data.row.index === rows.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        if (data.column.index === 0) {
                            data.cell.styles.halign = "right";
                        }
                    }
                }
            })

            // update progress bar
            progressBarValue++;
            setProgressBarValue(progressBarValue/maxProgressBarValue*100);
        }
    }

    // update progress bar
    progressBarValue++;
    setProgressBarValue(progressBarValue/maxProgressBarValue*100);

    // Save pdf to file
    var fileName = null
    if (sectionSelection==='zone_load_summary') {
        fileName = 'zone_load_summary.pdf';
    } else if (sectionSelection==='system_load_summary') {
        fileName = 'system_load_summary.pdf';
    }

    doc.save(fileName);

    // Clean up
    setAnimationEnable(true);
    setPdfPrint(false);

    var endTime = new Date().getTime();
    //alert((endTime - startTime)*0.001/60 + ' minutes');
}

const formatCardText = (unitSystem, dataMapping, data, t, ns) => {
    var cardText = '';
    dataMapping['items'].forEach(item => {
        // Set formatting for the unit labels
        const unitLabel = getUnitLabel(unitSystem, item["type"], t);

        // Set up array
        cardText += t(ns + ':' + item['displayName']) + ': ' + data[item["jsonKey"]]
        if (unitLabel) {
            cardText += ' ' + unitLabel;
        }
        cardText += '\n';
    })

    return cardText
}

const getColumnLabels = (unitSystem, mapKey, dataMapping, t, ns) => {
    var colLabels = [{header: '', dataKey: 'name'}];

    dataMapping[mapKey]['columns'].forEach(item => {
        colLabels.push({ header: getHeader(unitSystem, item, t, ns), dataKey: item['jsonKey']})
    })

    return colLabels
}

const convertObjectToPDFTable = (unitSystem, dataMapping, data, t, ns) => {
    var tableData = [];

    dataMapping['rows'].map((row) => {
        tableData.push(addDataRow(unitSystem, row, dataMapping['columns'], data, t, ns));
    })

    return tableData
}

const addDataRow = (unitSystem, row, columns, data, t, ns) => {
    const rowKey = row['jsonKey'];
    
    if (data) {
        var rowData = data[rowKey];
        var rowObject = {name: t(ns + ':' + row['displayName'])};
        
        columns.map((column) => {
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

            rowObject[column['jsonKey']] = dataValue;
        })

        return rowObject
        
    }
}

const getLongestString = (doc, data, fontSize, maxLen=35) => {
    let longestString = 0;

    data.forEach(item => {
        let length = doc.getStringUnitWidth(item[0])*fontSize*25.4/72;
        if (length > longestString) {
            longestString = length
        }
    });

    return longestString > maxLen ? maxLen : longestString
}

const dataToRows = (unitSystem, dataMapping, data, t, ns) => {
    var rows = []

    dataMapping['items'].forEach(item => {
        // Set formatting for the unit labels
        const unitLabel = getUnitLabel(unitSystem, item["type"], t);

        // Set up array
        let keyText = t(ns + ':' + item['displayName']) + ':'
        let value =  ' ' + convertDataUnit(unitSystem, item["type"], data[item["jsonKey"]]) + ' ' + unitLabel

        rows.push([keyText, value])
    })

    return rows
}