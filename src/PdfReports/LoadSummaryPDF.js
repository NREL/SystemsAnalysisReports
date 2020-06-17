import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//
import { getHeader } from '../functions/tableFunctions';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatUnitLabels } from '../functions/textFunctions';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export const LoadSummaryPDF = async (objectList, chart1Ref, chart2Ref, setPdfPrint, setZoneId, setHeatingCoolingSelection, setAnimationEnable, setProgressBarValue, dataMapping, data) => {
    var startTime = new Date().getTime();
    
    // UPDATES NEEDED HERE!!!
    const unitSystem = 'ip';  // THIS NEEDS TO BE PASSED FROM FUNCTION ARGUMENTS
    const pageTitle = 'Zone Load Summary'; // THIS NEEDS TO BE DETERMINED FROM COMPONENT STATE

    const cardFontSize = 6;
    const tableBodyStyle = { fontStyle: 'normal', fontSize: 5, textColor: 80, padding: 0, minCellHeight: 0, lineWidth: 0.1, fillColor: 255}
    const tableHeaderStyle =  { fontSize: 5, padding: 0, minCellHeight: 0, lineWidth: 0.1, halign: 'center' };
    const columnStyles = {
        sensible_instant: {cellWidth: 28, halign: 'center' },
        sensible_delayed: {cellWidth: 28, halign: 'center' },
        latent: {cellWidth: 28, halign: 'center' },
        total: {cellWidth: 28, halign: 'center' },
        percent_grand_total: {cellWidth: 28, halign: 'center' }
    };
    const tableSubHeaderSize = 7;
    const tableSubHeaderMargin = 2;

    // Default a4 size (210 x 297 mm), units in mm
    const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});

    // Turn off animations
    setAnimationEnable(false);

    var pageNum = 1;
    const heatingCoolingOptions = ['cooling', 'heating'];
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length * heatingCoolingOptions.length;

    console.log('Print page ' + pageNum);  // Console log first page
    for (var j = 0; j < heatingCoolingOptions.length; j++) {
        const heatingCoolingSelection = heatingCoolingOptions[j];

        for (var i = 0; i < objectList.length; i++) {
            var xStart = 0;
            var yStart = 0;
            
            // Set object for loop
            const objectId = i;
            setZoneId(i);
            setHeatingCoolingSelection(heatingCoolingSelection);
            const objectName = getObjectName(objectList, objectId);

            // update progress bar
            progressBarValue++;
            setProgressBarValue(progressBarValue/maxProgressBarValue*100);

            // Add page, if necessary
            if (!((i===0) && (j===0))) {
                pageNum++; // Increment page number
                console.log('Print page ' + pageNum);  // Console log each new page
                doc.addPage()
            }

            // Title
            doc.setFontSize(13);
            doc.text(pageTitle, 10, 10);

            // Object Name
            xStart = 10;
            yStart = 16;
            const objectNameWidth = doc.getStringUnitWidth(objectName)*11*25.4/72;
            doc.setDrawColor(0);
            doc.setFillColor(108, 117, 125);
            doc.rect(xStart-1, yStart-4, objectNameWidth+3, 5, 'F');
            doc.setTextColor(255,255,255);
            doc.setFontSize(11);
            doc.text(objectName, xStart, yStart);

            // Cooling/Heating Label
            xStart += objectNameWidth + 5;  // Place label next to the object name label
            yStart = 16;
            if(heatingCoolingSelection === 'cooling'){
                doc.setDrawColor(0);
                doc.setFillColor(0, 123, 255);
                doc.rect(xStart-1, yStart-4, 15, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text('Cooling', xStart, yStart);  
            } else if (heatingCoolingSelection === 'heating') {
                doc.setDrawColor(0);
                doc.setFillColor(220, 53, 69);
                doc.rect(xStart-1, yStart-4, 15, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text('Heating', xStart, yStart);  
            }

            // Write Peak Conditions
            yStart = 21;
            const peakConditionsData = data[objectName][heatingCoolingSelection]['peak_condition'];

            //var cardText = formatCardText(cardValueArray);
            var cardText = formatCardText(unitSystem, dataMapping['peakConditions'][0], peakConditionsData);
            doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(15, yStart, 35, 3, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(cardFontSize+1);
            doc.text('Conditions at Time of Peak', 15, yStart+2);
            doc.setFontSize(cardFontSize);
            doc.text(cardText, 15, yStart+6);

            // Write Outside Conditions
            yStart = 31;
            doc.setFontType("bold");
            doc.text(dataMapping['peakConditions'][1]['label'], 15, yStart);
            cardText = formatCardText(unitSystem, dataMapping['peakConditions'][1], peakConditionsData);
            doc.setFontType("normal");
            doc.setFontSize(cardFontSize);
            doc.text(cardText, 15, yStart+2);

            // Write Zone Conditions
            yStart = 41;
            doc.setFontType("bold");
            doc.text(dataMapping['peakConditions'][2]['label'], 15, yStart);
            cardText = formatCardText(unitSystem, dataMapping['peakConditions'][2], peakConditionsData);
            doc.setFontType("normal");
            doc.setFontSize(cardFontSize);
            doc.text(cardText, 15, yStart+2);

            // Write Engineering Checks
            yStart = 21;
            const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
            cardText = formatCardText(unitSystem, dataMapping['engineeringCheck'][0], engineeringCheckData);
            doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(60, yStart, 40, 3, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(cardFontSize+1);
            doc.text('Engineering Checks', 60, yStart+2);
            doc.setFontSize(cardFontSize);
            doc.text(cardText, 60, yStart+6);

            // Write Heating/Cooling Load Chart
            yStart = 5;

            let svg = ReactDOM.findDOMNode(chart1Ref.current);
            let width = svg.getBoundingClientRect().width;
            let height = svg.getBoundingClientRect().height;

            await domtoimage.toPng(svg, {
                width: width,
                height: height,
                style: {
                'transform': 'scale(1.0)',
                'transform-origin': 'top left'
                }
            })
            .then(function (dataUrl) {
                doc.addImage(dataUrl, 'PNG', 110, yStart, width/8, height/8);
            })
            .catch(function (error) {
                console.error('Chart 1 did not render properly.', error);
            });

            // Write Component Load Chart
            svg = ReactDOM.findDOMNode(chart2Ref.current);
            width = svg.getBoundingClientRect().width;
            height = svg.getBoundingClientRect().height;

            await domtoimage.toPng(svg, {
                width: width,
                height: height,
                style: {
                'transform': 'scale(1.0)',
                'transform-origin': 'top left'
                }
            })
            .then(function (dataUrl) {
                doc.addImage(dataUrl, 'PNG', 155, yStart, width/8, height/8);
            })
            .catch(function (error) {
                console.error('Chart 2 did not render properly.', error);
            });
            
            // Table Header
            yStart = 58;
            var mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping);

            doc.autoTable({
                bodyStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                alternateRowStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                headStyles: tableHeaderStyle,
                columnStyles: columnStyles,
                body: [{name: null, sensible_instant: null, sensible_delayed: null, latent: null, total: null, percent_grand_total: null}],
                columns: colLabels,
                startY: yStart+tableSubHeaderMargin,
            })

            // Envelope Loads Table
            yStart += 12;
            doc.setFontSize(tableSubHeaderSize);
            doc.text('Envelope', 15, yStart);
            var mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping);
            var tableData = convertObjectToPDFTable(unitSystem, heatingCoolingSelection, objectName, dataMapping[mapKey], data);

            doc.autoTable({
                tableLineWidth: 0.1,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })

            
            // Internal Gains Table
            yStart += 98;
            doc.setFontSize(tableSubHeaderSize);
            doc.text('Internal Gains', 15, yStart);
            mapKey = 'internalGainsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping);
            tableData = convertObjectToPDFTable(unitSystem, heatingCoolingSelection, objectName, dataMapping[mapKey], data);

            doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })

            
            // System Loads Table
            yStart += 37;
            doc.setFontSize(tableSubHeaderSize);
            doc.text('Systems', 15, yStart);
            mapKey = 'systemLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping);
            tableData = convertObjectToPDFTable(unitSystem, heatingCoolingSelection, objectName, dataMapping[mapKey], data);

            doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })

            // Total Loads Table
            yStart += 59;
            doc.setFontSize(tableSubHeaderSize);
            doc.text('Total', 15, yStart);
            mapKey = 'totalLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping);
            tableData = convertObjectToPDFTable(unitSystem, heatingCoolingSelection, objectName, dataMapping[mapKey], data);

            doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })
        }
    }

    doc.save('download.pdf');

    // Clean up
    setAnimationEnable(true);
    setPdfPrint(false);

    var endTime = new Date().getTime();
    //alert(endTime - startTime);
}

const formatCardText = (unitSystem, dataMapping, data) => {
    var cardText = '';
    dataMapping['items'].forEach(item => {
        // Set formatting for the unit labels
        const unitLabel = formatUnitLabels(getUnitLabel(unitSystem, item["type"]));

        // Set up array
        cardText += item['displayName'] + ': ' + data[item["jsonKey"]]
        if (unitLabel) {
            cardText += ' ' + unitLabel;
        }
        cardText += '\n';
    })

    return cardText
}

const getColumnLabels = (unitSystem, mapKey, dataMapping) => {
    var colLabels = [{header: '', dataKey: 'name'}];

    dataMapping[mapKey]['columns'].forEach(item => {
        colLabels.push({ header: getHeader(unitSystem, item), dataKey: item['jsonKey']})
    })

    return colLabels
}

const convertObjectToPDFTable = (unitSystem, heatingCoolingSelection, objectName, dataMapping, data) => {
    var tableData = [];
    const objectData = data[objectName][heatingCoolingSelection]['estimated_peak_load_component_table'];


    dataMapping['rows'].map((row) => {
        tableData.push(addDataRow(unitSystem, row, dataMapping['columns'], objectData));
    })

    return tableData
}

const addDataRow = (unitSystem, row, columns, data) => {
    const rowKey = row['jsonKey'];
    
    if (data) {
        var rowData = data[rowKey];
        var rowObject = {name: row['displayName']};
        
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