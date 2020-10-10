import ReactDOM from 'react-dom';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
    var docDefinition = {
        'content': [],
        styles: {
            header: {
              //fontSize: 22,
              //bold: true
            },
            tableBody: {
              fontSize: 8,
              //italics: true,
              //alignment: 'right'
            }
          }
    }

    // Default a4 size (210 x 297 mm), units in mm
    //const doc = new jsPDF({orientation: 'portrait', format: 'a4', unit: 'mm', compress: true});

    // Turn off animations
    setAnimationEnable(false);

    var pageNum = 1;
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length;

    // Initialize progress bar
    setProgressBarValue(progressBarValue);

    console.log('Print page ' + pageNum);  // Console log first page

    for (var i = 0; i < objectList.length; i++) {
        //var xStart = 0;
        //var yStart = 0;
        
        // Set object for loop
        const objectId = i;
        setObjectId(i);
        const objectName = getObjectName(objectList, objectId);

        // Delay to allow time to render
        //await sleep(50);

        // Add page, if necessary
        if (!(i===0)) {
            pageNum++; // Increment page number
            console.log('Print page ' + pageNum);  // Console log each new page
            //doc.addPage()
        }

        docDefinition['content'].push(
            {
                text: pageTitle,
                fontSize: 13,
                margin: [0, 5],
            }
        )

        // Title
        /*doc.setFontSize(13);
        doc.text(pageTitle, 10, 10);*/

        // Object Name
        //xStart = 10;
        //yStart = 16;
        //const objectNameWidth = doc.getStringUnitWidth(objectName)*11*25.4/72;
        /*doc.setDrawColor(0);
        doc.setFillColor(108, 117, 125);
        doc.rect(xStart-1, yStart-4, objectNameWidth+3, 5, 'F');
        doc.setTextColor(255,255,255);
        doc.setFontSize(11);
        doc.text(objectName, xStart, yStart);*/

        docDefinition['content'].push(
            {
                text: objectName,
                fontSize: 11,
                margin: [0, 5],
            }
        )

        // Summary
        //xStart = 15; 
        //yStart = 30;

        const coilData = data[objectName];

        var cardText = formatCardText(unitSystem, dataMapping['componentChecks'][0], coilData['summary'], t, ns);
        /*doc.setDrawColor(0);
        doc.setFillColor(221, 221, 221);
        doc.rect(xStart, yStart, 35, 3, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(cardFontSize+1);
        doc.text(t(ns + ':' + 'Summary'), xStart, yStart+2);
        doc.setFontSize(cardFontSize);
        doc.text(cardText, xStart, yStart+6);*/

        /*docDefinition['content'].push(
            {
                text: t(ns + ':' + 'Summary'),
                fontSize: cardFontSize+1
            },
            {
                text: cardText,
                fontSize: cardFontSize
            }
        )*/
        docDefinition['content'].push({
            table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                body: [
                    [
                        t(ns + ':' + 'Summary')
                    ],
                    [
                        cardText
                    ]
                ]
            },
            style: 'tableBody',
            margin: [0, 5]
        })

        // Write Psychrometric Chart
        //yStart = 56;

        const svg = ReactDOM.findDOMNode(chart1Ref.current);
        //let width = svg.getBoundingClientRect().width;
        //let height = svg.getBoundingClientRect().height;

        docDefinition['content'].push({
            // if you specify width, svg will scale proportionally
            svg: svg.outerHTML,
            width: 480,
            margin: [5, 5]
        });

        // System Components Table
        //yStart = 150;
        var mapKey = 'componentTable';
        var tempTableData = formatDesignPsychrometricsTableData(dataMapping[mapKey], coilData)
        var tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

        docDefinition['content'].push({
            //layout: 'lightHorizontalLines', // optional
            table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                //widths: [ '*', 'auto', 100, '*' ],
                //widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                body: tableData
            },
            layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
			},
            style: 'tableBody',
            margin: [0, 5]
        })

        // Add page, if necessary
        if (i < objectList.length) {
            docDefinition['content'].push(
                {
                    text: "-",
                    pageBreak: "after" // or before
                },
            )
        }

        // update progress bar
        progressBarValue++;
        setProgressBarValue(progressBarValue/maxProgressBarValue*100);
    }

    // update progress bar
    progressBarValue++;
    setProgressBarValue(progressBarValue/maxProgressBarValue*100);

    //await sleep(20000);

    // Save pdf to file
    const fileName = 'design_psychrometrics.pdf';
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).download();

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
        //colLabels.push({ header: getHeader(unitSystem, item, t, ns), dataKey: item['jsonKey']})
        colLabels.push(getHeader(unitSystem, item, t, ns));
    })

    return colLabels
}

const convertObjectToPDFTable = (unitSystem, dataMapping, data, t, ns) => {
    var tableData = [];
    var headerRow = [''];

    // Header row
    dataMapping['columns'].map((column) => {
        headerRow.push(getHeader(unitSystem, column, t, ns));
        //headerRow.push(t(ns + ':' + column['displayName']));
    })
    tableData.push(headerRow);

    // Body row
    dataMapping['rows'].map((row) => {
        var dataRow = addDataRow(unitSystem, row, dataMapping['columns'], data, t, ns);
        tableData.push(dataRow);
    })

    return tableData
}

const addDataRow = (unitSystem, row, columns, data, t, ns) => {
    const rowKey = row['jsonKey'];
    
    if (data) {
        var rowData = data[rowKey];
        //var rowObject = {name: t(ns + ':' + row['displayName'])};
        var rowObject = [];
        rowObject.push(t(ns + ':' + row['displayName']));
        
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

            //rowObject[column['jsonKey']] = dataValue;
            rowObject.push(dataValue);
        })

        return rowObject
        
    }
}