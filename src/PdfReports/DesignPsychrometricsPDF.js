import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getHeader } from '../functions/tableFunctions';
import { sleep } from '../functions/generalFunctions';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatDesignPsychrometricsTableData } from '../functions/tableFunctions';
import '../../public/fonts/jsPDF/ArtifaktElement-normal'
import '../../public/fonts/jsPDF/ArtifaktElement-bold'

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
    // Set title for report
    const pageTitle = t(ns + ':' + 'Design Psychrometrics');
    const cardFontSize = 6;
    const tableBodyStyle = { fontStyle: 'normal', fontSize: 8, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, fillColor: 255}
    const tableHeaderStyle =  { fontStyle: 'normal', fontSize: 8, textColor: '#000000', padding: 0, minCellHeight: 0, lineWidth: 0, halign: 'center', fillColor: '#E5E5E5' };
    const columnStyles = {
        name: {cellWidth: 20, halign: 'left', cellPadding: {top: 2, right: 0, bottom: 2, left: 2} },
        dry_bulb_temperature: {cellWidth: 20, halign: 'center' },
        wetbulb_temperature: {cellWidth: 20, halign: 'center' },
        dewpoint_temperature: {cellWidth: 20, halign: 'center' },
        humidity_ratio: {cellWidth: 20, halign: 'center' },
        relative_humidity: {cellWidth: 20, halign: 'center' },
        enthalpy: {cellWidth: 20, halign: 'center' },
        air_specific_heat: {cellWidth: 20, halign: 'center' },
        air_density: {cellWidth: 20, halign: 'center' },
        air_specific_volume: {cellWidth: 20, halign: 'center' }
    };
    const tableSubHeaderSize = 7;
    const tableSubHeaderMargin = 2;

    // Default a4 size (210 x 297 mm), units in mm
    const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});
    doc.setFont('ArtifaktElement');
    const baseFont = doc.getFont()['fontName'];

    // Turn off animations
    setAnimationEnable(false);

    var pageNum = 1;
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length;

    // Initialize progress bar
    setProgressBarValue(progressBarValue);

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
            doc.addPage()
        }

        // Title
        doc.setFontSize(14);
        doc.setFont(baseFont, "bold")
        doc.text(pageTitle, 5, 10);

        const pageTitleWidth = doc.getStringUnitWidth(pageTitle)*14*25.4/72

        let xStartLine = 5 + pageTitleWidth + 5
        doc.setDrawColor("#EEEEEE")
        doc.setLineWidth(0.025)
        doc.line(xStartLine, 6, xStartLine, 11)

        // Horizontal Line
        xStartLine = 5
        doc.setDrawColor("#EEEEEE")
        doc.setLineWidth(0.025)
        doc.line(xStartLine, 13, 205, 13)

        // Object Name
        xStart = 7 + pageTitleWidth + 10;
        yStart = 10;
        const objectNameWidth = doc.getStringUnitWidth(objectName)*11*25.4/72;
        doc.setDrawColor(0);
        doc.setFillColor(108, 117, 125);
        doc.rect(xStart-1, yStart-4, objectNameWidth+2, 5, 'F');
        doc.setTextColor(255,255,255);
        doc.setFont(baseFont, "normal")
        doc.setFontSize(10);
        doc.text(objectName, xStart, yStart);

        // Summary
        xStart = 5;
        yStart = 16;

        doc.setDrawColor(0);
        doc.setFillColor(221, 221, 221);
        doc.rect(xStart, yStart, 200, 5, 'F');
        doc.setFontSize(7);
        doc.setFont(baseFont, "bold")
        doc.setTextColor(0,0,0);
        doc.text(t(ns + ':' + 'Summary'), xStart + 2, yStart + 3.5);

        const coilData = data[objectName];

        // Time of Peak
        xStart = 7
        yStart = 25
        let time_of_peak_map = dataMapping['componentChecks'][0]['items'][0]
        let label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        let value = coilData['summary'][time_of_peak_map['jsonKey']]
        doc.setFontSize(6);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value, xStart+1.5, yStart+3)

        // atmospheric pressure
        xStart = 7
        yStart = 35
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][1]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        let unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        // zone space sensible load:
        xStart = 45
        yStart = 25
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][2]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        //coil_air_flow_rate
        xStart = 45
        yStart = 35
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][3]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        // Outdoor Air Flow Rate
        xStart = 100
        yStart = 25
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][4]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        // Percent Outdoor Air
        xStart = 100
        yStart = 35
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][5]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        // Supply Fan Temperature Difference
        xStart = 140
        yStart = 25
        time_of_peak_map = dataMapping['componentChecks'][0]['items'][6]
        label = t(ns+":"+time_of_peak_map['displayName']) + ':';
        value = coilData['summary'][time_of_peak_map['jsonKey']]
        value = (value == null ? '-' : convertDataUnit(unitSystem, time_of_peak_map["type"], value))
        unitLabel = getUnitLabel(unitSystem, time_of_peak_map["type"], t);
        doc.setFont(baseFont, "bold");
        doc.text(label, xStart, yStart)

        doc.setFont(baseFont, "normal");
        doc.text(value + ' ' + unitLabel, xStart+1.5, yStart+3)

        // Write Psychrometric Chart
        yStart = 50;

        const svg = ReactDOM.findDOMNode(chart1Ref.current);
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
            doc.addImage(dataUrl, 'PNG', (210 - width/4)/2, yStart, width/4, height/4);
        })
        .catch(function (error) {
            console.error('Psychrometric chart did not render properly.', error);
        });

        // System Components Table
        yStart = 190;
        var mapKey = 'componentTable';
        var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
        var tempTableData = formatDesignPsychrometricsTableData(dataMapping[mapKey], coilData)
        var tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

        doc.autoTable({
            margin: 5,
            tableLineWidth: 0,
            bodyStyles: tableBodyStyle,
            headStyles: tableHeaderStyle,
            columnStyles: columnStyles,
            body: tableData,
            columns: colLabels,
            startY: yStart+tableSubHeaderMargin,
            styles: {
                cellPadding: {top: 2, right: 0, bottom: 2, left: 0},
                font: "ArtifaktElement"
            }
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