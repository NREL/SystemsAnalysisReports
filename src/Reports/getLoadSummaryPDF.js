import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatUnitLabels } from '../functions/textFunctions';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export const getLoadSummaryPDF = async (objectList, chartRef, chart1Ref, chart2Ref, cardRef, setPdfPrint, setZoneId, dataMapping, data) => {
    const heatingCoolingSelection = 'cooling';
    const unitSystem = 'ip';
    const pageTitle = 'Zone Load Summary:';
    const cardFontSize = 6;
    const tableStyle =  { fontSize: 5, padding: 0, minCellHeight: 0};
    const tableSubHeaderSize = 7;
    const tableSubHeaderMargin = 2;

    // Default a4 size (210 x 297 mm), units in mm
    const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});

    for (var i = 0; i < objectList.length; i++) {
        var yStart = 0;
        
        // Set object for loop
        const objectId = i;
        setZoneId(i);
        const objectName = getObjectName(objectList, objectId);
        //console.log(objectId);
        await sleep(1000);

        // Add page, if necessary
        if (i>0) { doc.addPage() }

        // Title
        doc.setFontSize(12);
        doc.text(pageTitle, 10, 10);

        // Cooling/Heating
        if(heatingCoolingSelection === 'cooling'){
            doc.setFontSize(10);
            doc.text('Cooling', 55, 10);  
        } else if (heatingCoolingSelection === 'heating') {
            doc.setFontSize(10);
            doc.text('Heating', 55, 10);  
        }

        // Object Name
        doc.setFontSize(11);
        doc.text(objectName, 10, 15);

        // Write Peak Conditions
        yStart = 20;
        const peakConditionsData = data[objectName][heatingCoolingSelection]['peak_condition'];

        /*var cardValueArray = [];
        const peakConditionsData = data[objectName][heatingCoolingSelection]['peak_condition'];
        dataMapping['peakConditions'][0]['items'].forEach(item => {
            cardValueArray.push(item['displayName'] + ': ' + peakConditionsData[item["jsonKey"]]);
            cardValueArray.push(item['displayName'] + ': ' + peakConditionsData[item["jsonKey"]] + ' ' + unitLabel);
        })*/

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
        yStart = 30;
        /*cardValueArray = [];
        dataMapping['peakConditions'][1]['items'].forEach(item => {
            // Set formatting for the unit labels
            const unitLabel = formatUnitLabels(getUnitLabel(unitSystem, item["type"]));

            // Set up array
            cardValueArray.push(item['displayName'] + ': ' + peakConditionsData[item["jsonKey"]] + ' ' + unitLabel);
        })*/

        doc.setFontType("bold");
        doc.text(dataMapping['peakConditions'][1]['label'], 15, yStart);
        //var cardText = formatCardText(cardValueArray);
        cardText = formatCardText(unitSystem, dataMapping['peakConditions'][1], peakConditionsData);
        doc.setFontType("normal");
        doc.setFontSize(cardFontSize);
        doc.text(cardText, 15, yStart+2);

        // Write Zone Conditions
        yStart = 40;
        /*
        cardValueArray = [];
        dataMapping['peakConditions'][2]['items'].forEach(item => {
            cardValueArray.push(item['displayName'] + ': ' + peakConditionsData[item["jsonKey"]]);
        })*/

        doc.setFontType("bold");
        doc.text(dataMapping['peakConditions'][2]['label'], 15, yStart);
        //var cardText = formatCardText(cardValueArray);
        cardText = formatCardText(unitSystem, dataMapping['peakConditions'][2], peakConditionsData);
        doc.setFontType("normal");
        doc.setFontSize(cardFontSize);
        doc.text(cardText, 15, yStart+2);

        // Write Engineering Checks
        yStart = 20;
        const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
        console.log(engineeringCheckData);
        console.log(dataMapping['engineeringCheck'][0]);
        
        /*cardValueArray = [];
        const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
        dataMapping['engineeringCheck'][0]['items'].forEach(item => {
            cardValueArray.push(item['displayName'] + ': ' + engineeringCheckData[item["jsonKey"]]);
        })*/

        //cardText = formatCardText(cardValueArray);
        cardText = formatCardText(unitSystem, dataMapping['engineeringCheck'][0], engineeringCheckData);
        doc.setDrawColor(0);
        doc.setFillColor(221, 221, 221);
        doc.rect(60, yStart, 30, 3, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(cardFontSize+1);
        doc.text('Engineering Checks', 60, yStart+2);
        doc.setFontSize(cardFontSize);
        doc.text(cardText, 60, yStart+6);

        sleep(100000);

        // Write Heating/Cooling Load Chart
        yStart = 10;

        await html2canvas(chart1Ref.current, {
            width: 800,
            height: 800,
            }).then(canvas => {
                var imgData = canvas.toDataURL('image/png');
                var imgProps= doc.getImageProperties(imgData);
                //var pdfWidth = doc.internal.pageSize.getWidth();
                //var pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                var pdfWidth = doc.internal.pageSize.getWidth()*0.3;
                var pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                console.log(pdfWidth);
                console.log(pdfHeight);
                doc.addImage(imgData, 'PNG', 95, 3, 125, 125);
            })


        // Write Component Load Chart
        await html2canvas(chart2Ref.current, {
            width: 800,
            height: 800,
            }).then(canvas => {
                var imgData = canvas.toDataURL('image/png');
                var imgProps= doc.getImageProperties(imgData);
                //var pdfWidth = doc.internal.pageSize.getWidth();
                //var pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                var pdfWidth = doc.internal.pageSize.getWidth()*0.3;
                var pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                console.log(pdfWidth);
                console.log(pdfHeight);
                doc.addImage(imgData, 'PNG', 145, 3, 125, 125);
            })

        // Envelope Loads Table
        yStart = 65;

        doc.setFontSize(tableSubHeaderSize);
        doc.text('Envelope', 15, yStart);

        var mapKey = 'envelopeLoadsTable';
        var colLabels = getColumnLabels(mapKey, dataMapping);
        var tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            margin: { top: 0, bottom: 0 },
            body: tableData,
            columns: colLabels,
            startY: yStart+tableSubHeaderMargin,
        })

        
        // Internal Gains Table
        //yStart = 165;
        yStart += 103;

        doc.setFontSize(tableSubHeaderSize);
        doc.text('Internal Gains', 15, yStart);

        mapKey = 'internalGainsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: yStart+tableSubHeaderMargin,
        })

        
        // System Loads Table
        //yStart = 200;
        yStart += 37;

        doc.setFontSize(tableSubHeaderSize);
        doc.text('Systems', 15, yStart);

        mapKey = 'systemLoadsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: yStart+tableSubHeaderMargin,
        })

        // Total Loads Table
        //yStart = 260;
        yStart += 59;

        doc.setFontSize(tableSubHeaderSize);
        doc.text('Total', 15, yStart);

        mapKey = 'totalLoadsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: yStart+tableSubHeaderMargin,
        })
    }

    sleep(1000000);
    doc.save('download.pdf');

    setPdfPrint(false);
}

const formatCardText = (unitSystem, dataMapping, data) => {
    var cardText = '';
    dataMapping['items'].forEach(item => {
        // Set formatting for the unit labels
        //const unitLabel = formatUnitLabels(getUnitLabel(unitSystem, item["type"]));
        const unitLabel = getUnitLabel(unitSystem, item["type"]);

        console.log(item["type"]);
        console.log(unitLabel);

        // Set up array
        cardText += item['displayName'] + ': ' + data[item["jsonKey"]]
        if (unitLabel) {
            cardText += ' ' + unitLabel;
        }
        cardText += '\n';
    })

    return cardText
}

const getColumnLabels = (mapKey, dataMapping) => {
    var colLabels = [{header: '', dataKey: 'name'}];

    dataMapping[mapKey]['columns'].forEach(item => {
        colLabels.push({ header: item['displayName'], dataKey: item['jsonKey']})
    })

    return colLabels
}

const convertObjectToPDFTable = (objectName, dataMapping, data) => {
    const unitSystem = 'ip';
    const heatingCoolingSelection = 'cooling'
    //const mapName = 'envelopeLoadsTable';

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
        var rowObject = {name: rowKey};
        
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

                    }
                }
            }

            rowObject[column['jsonKey']] = dataValue;
        })

        return rowObject
        
    }
}