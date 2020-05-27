import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export const getLoadSummaryPDF = async (objectList, chartRef, chart1Ref, chart2Ref, cardRef, setPdfPrint, setZoneId, dataMapping, data) => {
    const heatingCoolingSelection = 'cooling';
    const pageTitle = 'Zone Load Summary:';
    const tableStyle =  { fontSize: 7, padding: 0, minCellHeight: 0};

    // Default a4 size (210 x 297 mm), units in mm
    const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});

    for (var i = 0; i < objectList.length; i++) {
        
        // Set object for loop
        const objectId = i;
        setZoneId(i);
        const objectName = getObjectName(objectList, objectId);
        //console.log(objectId);
        await sleep(1000);

        // Add page, if necessary
        if (i>0) { doc.addPage() }

        // Title
        doc.setFontSize(10);
        doc.text(pageTitle, 10, 10);
        doc.setFontSize(8);
        doc.text(objectName, 50, 10);

        // Write Heating/Cooling Load Chart
        var yStart = 10;

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
                doc.addImage(imgData, 'PNG', 75, 10, 125, 125);
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
                doc.addImage(imgData, 'PNG', 125, 10, 125, 125);
            })

        // Write Engineering Checks
        //console.log(dataMapping['engineeringCheck']);
        //sleep(2000);
        
        var cardValueArray = [];
        const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
        dataMapping['engineeringCheck'][0]['items'].forEach(item => {
            cardValueArray.push(item['displayName'] + ': ' + engineeringCheckData[item["jsonKey"]]);
        })

        var cardText = formatCardText(cardValueArray);
        doc.setFontSize(8);
        doc.text(cardText, 15, 20);
        
        /*
        await html2canvas(cardRef.current, {
            width: 800,
            height: 800,
            }).then(canvas => {
                var imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 130, 10, 125, 125);
            }) 
        */      

        // Envelope Loads Table
        var zStart = 70;

        doc.setFontSize(9);
        doc.text('Envelope', 15, zStart);

        var mapKey = 'envelopeLoadsTable';
        var colLabels = getColumnLabels(mapKey, dataMapping);
        var tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            startY: zStart+3,
        })

        
        // Internal Gains Table
        zStart = 165;

        doc.setFontSize(9);
        doc.text('Internal Gains', 15, zStart);

        mapKey = 'internalGainsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: zStart+3,
        })

        
        // System Loads Table
        zStart = 195;

        doc.setFontSize(9);
        doc.text('Systems', 15, zStart);

        mapKey = 'systemLoadsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: zStart+3,
        })

        // Total Loads Table
        zStart = 255;

        doc.setFontSize(9);
        doc.text('Total', 15, zStart);

        mapKey = 'totalLoadsTable';
        colLabels = getColumnLabels(mapKey, dataMapping);
        tableData = convertObjectToPDFTable(objectName, dataMapping[mapKey], data);

        doc.autoTable({
            bodyStyles: tableStyle,
            headStyles: tableStyle,
            body: tableData,
            columns: colLabels,
            showHead: 'never',
            startY: zStart+3,
        })
    }

    doc.save('download.pdf');

    setPdfPrint(false);
}

const formatCardText = (data) => {
    var cardText = '';
    data.forEach(item => {
        cardText += item;
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