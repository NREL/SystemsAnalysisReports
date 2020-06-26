import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getHeader } from '../functions/tableFunctions';
import { sleep } from '../functions/generalFunctions';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatDesignPsychrometricsTableData } from '../functions/tableFunctions';

export const DesignPsychrometricsPDF = async (
    unitSystem,
    sectionSelection,
    objectList,
    chart1Ref,
    setPdfPrint,
    setObjectId,
    setAnimationEnable,
    setProgressBarValue,
    dataMapping,
    data,
    ns,
    t
    ) => {
    var startTime = new Date().getTime();
    
    // Set title for report
    const pageTitle = t(ns + ':' + 'Design Psychrometrics');
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
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length;

    // Initialize progress bar
    setProgressBarValue(progressBarValue);

    console.log('Print page ' + pageNum);  // Console log first page

    for (var i = 0; i < objectList.length; i++) {
        var xStart = 0;
        var yStart = 0;
        
        // Set object for loop
        const objectId = i;
        setObjectId(i);
        const objectName = getObjectName(objectList, objectId);

        // Delay to allow time to render
        await sleep(50);

        // Add page, if necessary
        if (!(i===0)) {
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

        // Summary
        xStart = 15; 
        yStart = 30;

        const coilData = data[objectName];

        var cardText = formatCardText(unitSystem, dataMapping['componentChecks'][0], coilData['summary'], t, ns);
        doc.setDrawColor(0);
        doc.setFillColor(221, 221, 221);
        doc.rect(xStart, yStart, 35, 3, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(cardFontSize+1);
        doc.text(t(ns + ':' + 'Summary'), xStart, yStart+2);
        doc.setFontSize(cardFontSize);
        doc.text(cardText, xStart, yStart+6);

        // Write Psychrometric Chart
        yStart = 56;

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
            doc.addImage(dataUrl, 'PNG', (210 - width/6)/2, yStart, width/6, height/6);
        })
        .catch(function (error) {
            console.error('Psychrometric chart did not render properly.', error);
        });

        // System Components Table
        yStart = 150;
        var mapKey = 'componentTable';
        var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
        var tempTableData = formatDesignPsychrometricsTableData(dataMapping[mapKey], coilData)
        var tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

        doc.autoTable({
            tableLineWidth: 0.1,
            bodyStyles: tableBodyStyle,
            headStyles: tableHeaderStyle,
            columnStyles: columnStyles,
            body: tableData,
            columns: colLabels,
            startY: yStart+tableSubHeaderMargin,
        })

        // update progress bar
        progressBarValue++;
        setProgressBarValue(progressBarValue/maxProgressBarValue*100);
    }

    // update progress bar
    progressBarValue++;
    setProgressBarValue(progressBarValue/maxProgressBarValue*100);

    // Save pdf to file
    const fileName = 'design_psychrometrics.pdf';
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
        const unitLabel = getUnitLabel(unitSystem, item["type"]);

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