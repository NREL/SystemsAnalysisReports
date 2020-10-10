import ReactDOM from 'react-dom';
//import domtoimage from 'dom-to-image';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { sleep } from '../functions/generalFunctions';
import { getHeader } from '../functions/tableFunctions';
import { getObjectName, convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { formatLoadSummaryTableData } from '../functions/tableFunctions';

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
        pageTitle = 'Zone Load Summary';
    }  else if (sectionSelection==='system_load_summary') {
        pageTitle = t(ns + ':' + 'System Load Summary');
    } else {
        pageTitle = '';
    }

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
    const heatingCoolingOptions = ['cooling', 'heating'];
    var progressBarValue = 0;
    const maxProgressBarValue = objectList.length * heatingCoolingOptions.length;

    // Initialize progress bar
    setProgressBarValue(progressBarValue);

    console.log('Print page ' + pageNum);  // Console log first page
    for (var j = 0; j < heatingCoolingOptions.length; j++) {
        const heatingCoolingSelection = heatingCoolingOptions[j];

        for (var i = 0; i < objectList.length; i++) {
            //var xStart = 0;
            //var yStart = 0;
            
            // Set object for loop
            const objectId = i;
            setObjectId(i);
            setHeatingCoolingSelection(heatingCoolingSelection);
            const objectName = getObjectName(objectList, objectId);

            // Add page, if necessary
            if (!((i===0) && (j===0))) {
                pageNum++; // Increment page number
                console.log('Print page ' + pageNum);  // Console log each new page
                //doc.addPage()
            }

            // Title
            //doc.setFontSize(13);
            //doc.text(t(ns+":"+pageTitle), 10, 10);
            docDefinition['content'].push(
                {
                    text: pageTitle,
                    fontSize: 13,
                    margin: [0, 5],
                }
            )

            // Object Name
            //const objectNameWidth = doc.getStringUnitWidth(objectName)*11*25.4/72;
            //xStart = 10;
            //yStart = 16;
            /*const objectNameWidth = doc.getStringUnitWidth(objectName)*11*25.4/72;
            doc.setDrawColor(0);
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

            // Cooling/Heating Label
            if(heatingCoolingSelection === 'cooling'){
                /*doc.setDrawColor(0);
                doc.setFillColor(0, 123, 255);
                doc.rect(xStart-1, yStart-4, 15, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text(t(ns+":"+'Cooling'), xStart, yStart);  */
                docDefinition['content'].push(
                    {
                        text: t(ns+":"+'Cooling'),
                        fontSize: 10,
                        margin: [0, 2],
                    }
                )
            } else if (heatingCoolingSelection === 'heating') {
                /*doc.setDrawColor(0);
                doc.setFillColor(220, 53, 69);
                doc.rect(xStart-1, yStart-4, 15, 5, 'F');
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text(t(ns+":"+'Heating'), xStart, yStart);  */
                docDefinition['content'].push(
                    {
                        text: t(ns+":"+'Heating'),
                        fontSize: 10,
                        margin: [0, 2],
                    }
                )
            }

            // Write Peak Conditions
            const peakConditionsData = data[objectName][heatingCoolingSelection]['peak_condition'];
            var cardText = formatCardText(unitSystem, dataMapping['peakConditions'][0], peakConditionsData, t, ns);
            var cardTitle = t(ns + ':' + 'Conditions at Time of Peak');
            docDefinition['content'].push(getCardDocDefinition(cardTitle, cardText));
            /*doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(xStart, yStart, 35, 3, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(cardFontSize+1);
            doc.text(t(ns + ':' + 'Conditions at Time of Peak'), xStart, yStart+2);
            doc.setFontSize(cardFontSize);
            doc.text(cardText, xStart, yStart+6);*/

            // Write Outside Conditions
             cardText = formatCardText(unitSystem, dataMapping['peakConditions'][1], peakConditionsData, t, ns);
            cardTitle = t(ns + ':' + dataMapping['peakConditions'][1]['label']);
            docDefinition['content'].push(getCardDocDefinition(cardTitle, cardText));
            /*doc.setFontType("bold");
            doc.text(t(ns + ':' + dataMapping['peakConditions'][1]['label']), xStart, yStart);
            doc.setFontType("normal");
            doc.setFontSize(cardFontSize);
            doc.text(cardText, xStart, yStart+2);*/

            // Write Zone Conditions
            if (sectionSelection==='zone_load_summary') {
                cardText = formatCardText(unitSystem, dataMapping['peakConditions'][2], peakConditionsData, t, ns);
                cardTitle = t(ns + ':' + dataMapping['peakConditions'][2]['label']);

                //docDefinition['content'].push(getMultiCardDocDefinition(cardTitle, subTitle1, cardText1, subTitle2, cardText2));
                
                /*doc.setFontType("bold");
                doc.text(t(ns + ':' + dataMapping['peakConditions'][2]['label']), xStart, yStart);
                doc.setFontType("normal");
                doc.setFontSize(cardFontSize);
                doc.text(cardText, xStart, yStart+2);*/
            }

            if (sectionSelection==='system_load_summary') {
                // Write Temperatures
                const temperatureData = data[objectName][heatingCoolingSelection]['temperature'];
                cardText = formatCardText(unitSystem, dataMapping['temperatures'][0], temperatureData, t, ns);
                cardTitle = t(ns + ':' + 'Temperatures');
                docDefinition['content'].push(getCardDocDefinition(cardTitle, cardText));
                /*doc.setDrawColor(0);
                doc.setFillColor(221, 221, 221);
                doc.rect(xStart, yStart, 35, 3, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(cardFontSize+1);
                doc.text(t(ns + ':' + 'Temperatures'), xStart, yStart+2);
                doc.setFontSize(cardFontSize);
                doc.text(cardText, xStart, yStart+6);*/

                // Write Airflows
                const airflowData = data[objectName][heatingCoolingSelection]['airflow'];
                cardText = formatCardText(unitSystem, dataMapping['airflows'][0], airflowData, t, ns);
                cardTitle = t(ns + ':' + 'Airflows');
                docDefinition['content'].push(getCardDocDefinition(cardTitle, cardText));
                /*doc.setDrawColor(0);
                doc.setFillColor(221, 221, 221);
                doc.rect(xStart, yStart, 35, 3, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(cardFontSize+1);
                doc.text(t(ns + ':' + 'Airflows'), xStart, yStart+2);
                doc.setFontSize(cardFontSize);
                doc.text(cardText, xStart, yStart+6);*/
            }

            // Write Engineering Checks
            const engineeringCheckData = data[objectName][heatingCoolingSelection]['engineering_check'];
            cardText = formatCardText(unitSystem, dataMapping['engineeringCheck'][0], engineeringCheckData, t, ns);
            cardTitle = t(ns + ':' + 'Engineering Checks');
            docDefinition['content'].push(getCardDocDefinition(cardTitle, cardText));
            /*doc.setDrawColor(0);
            doc.setFillColor(221, 221, 221);
            doc.rect(xStart, yStart, 40, 3, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(cardFontSize+1);
            doc.text(t(ns + ':' + 'Engineering Checks'), xStart, yStart+2);
            doc.setFontSize(cardFontSize);
            doc.text(cardText, xStart, yStart+6);*/

            // Write Heating/Cooling Load Chart
            //let svgChart = ReactDOM.findDOMNode(chart1Ref.current).children[0];
            //let svgLegend = ReactDOM.findDOMNode(chart1Ref.current).children[1].children[0];
            //let width = svgChart.getBoundingClientRect().width;
            //let height = svgChart.getBoundingClientRect().height;

            //console.log(svgChart);
            //console.log(svgLegend);

            /*docDefinition['content'].push({
                svg: svgChart.outerHTML,
                width: 150,
                //margin: [5, 5]
            });*/
            
            /*docDefinition['content'].push({
                svg: "<svg class=\"recharts-surface\" width=\"14\" height=\"14\" style=\"display: inline-block; vertical-align: middle; margin-right: 4px;\" viewBox=\"0 0 32 32\" version=\"1.1\"><path stroke=\"none\" fill=\"#3399FF\" d=\"M0,4h32v24h-32z\" class=\"recharts-legend-icon\"></path></svg><span class=\"recharts-legend-item-text\"><span style=\"font-size: 12px; display: inline-block;\">Cooling</span></span></li><li class=\"recharts-legend-item legend-item-1\" style=\"display: inline-block; margin-right: 10px;\"><svg class=\"recharts-surface\" width=\"14\" height=\"14\" style=\"display: inline-block; vertical-align: middle; margin-right: 4px;\" viewBox=\"0 0 32 32\" version=\"1.1\"><path stroke=\"none\" fill=\"#FF3333\" d=\"M0,4h32v24h-32z\" class=\"recharts-legend-icon\"></path></svg><span class=\"recharts-legend-item-text\"><span style=\"font-size: 12px; display: inline-block;\">Heating</span></span></li>",
                //svg: svgLegend.outerHTML,
                //width: 150,
                //margin: [5, 5]
            });*/

            /*await domtoimage.toPng(svg, {
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
            });*/

            // Write Component Load Chart
            let svgChart = ReactDOM.findDOMNode(chart2Ref.current);
            //svgLegend = ReactDOM.findDOMNode(chart2Ref.current).children[1].children[0];
            //width = svgChart.getBoundingClientRect().width;
            //height = svgChart.getBoundingClientRect().height;
            //console.log(svgChart.outerHTML);
            //await sleep(10000);

            var html = htmlToPdfmake(svgChart.outerHTML);
            console.log(html);
            docDefinition['content'].push(html);

            /*if (this.chart2Ref && this.chart2Ref.current) {
                svgChart = ReactDOM.findDOMNode(chart2Ref.current);
                console.log(svgChart);
                await domtoimage.toSvg(svgChart) //, { bgcolor: '#ffffff' })
                .then((dataUrl) => {
                    console.log(dataUrl);
                    //const download = document.createElement('a');
                    //download.href = dataUrl;
                    //download.download = `chart.png`;
                    //download.dispatchEvent(new MouseEvent('click'));
                })
                .catch((error) => {
                    console.error('Something went wrong!', error);
                });
            }*/

            /*docDefinition['content'].push({
                svg: svgChart.outerHTML,
                width: 150,
                margin: [5, 5]
            });*/

            /*await domtoimage.toPng(svg, {
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
            });*/
            
            // Load Components Table
            const loadComponentsData = data[objectName][heatingCoolingSelection]['estimated_peak_load_component_table'];

            //Table Header
            //yStart = 56;
            var mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);

            /*doc.autoTable({
                bodyStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                alternateRowStyles: { lineWidth: 0, fillColor: [255, 255, 255]},
                headStyles: tableHeaderStyle,
                columnStyles: columnStyles,
                body: [{name: null, sensible_instant: null, sensible_delayed: null, latent: null, total: null, percent_grand_total: null}],
                columns: colLabels,
                startY: yStart+tableSubHeaderMargin,
            })*/

            // Envelope Loads Table
            //yStart += 12;
            //doc.setFontSize(tableSubHeaderSize);
            //doc.text(t(ns + ':' + 'Envelope'), 15, yStart);
            var mapKey = 'envelopeLoadsTable';
            var colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            var tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            var tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            /*doc.autoTable({
                tableLineWidth: 0.1,
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })*/

            
            // Internal Gains Table
            //yStart += 97;
            //doc.setFontSize(tableSubHeaderSize);
            //doc.text(t(ns + ':' + 'Internal Gains'), 15, yStart);
            mapKey = 'internalGainsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            /*doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })*/

            
            // System Loads Table
            //yStart += 36;
            //doc.setFontSize(tableSubHeaderSize);
            //doc.text(t(ns + ':' + 'Systems'), 15, yStart);
            mapKey = 'systemLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            /*
            doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })*/

            // Total Loads Table
            /*if (sectionSelection==='zone_load_summary') {
                yStart += 59;
            } else if (sectionSelection==='system_load_summary') {
                yStart += 63;
            }*/
            //doc.setFontSize(tableSubHeaderSize);
            //doc.text(t(ns + ':' + 'Total'), 15, yStart);
            mapKey = 'totalLoadsTable';
            colLabels = getColumnLabels(unitSystem, mapKey, dataMapping, t, ns);
            tempTableData = formatLoadSummaryTableData(dataMapping[mapKey], loadComponentsData)
            tableData = convertObjectToPDFTable(unitSystem, dataMapping[mapKey], tempTableData, t, ns);

            /*doc.autoTable({
                bodyStyles: tableBodyStyle,
                columnStyles: columnStyles,
                body: tableData,
                columns: colLabels,
                showHead: 'never',
                startY: yStart+tableSubHeaderMargin,
            })*/

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
    }

    // update progress bar
    progressBarValue++;
    setProgressBarValue(progressBarValue/maxProgressBarValue*100);

    //await sleep(20000);

    // Save pdf to file
    var fileName = null
    if (sectionSelection==='zone_load_summary') {
        fileName = 'zone_load_summary.pdf';
    } else if (sectionSelection==='system_load_summary') {
        fileName = 'system_load_summary.pdf';
    }

    //doc.save(fileName);
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

const getCardDocDefinition = (cardTitle, cardText) => {
    const docDef = {
        table: {
            headerRows: 1,
            body: [
                [
                    cardTitle
                ],
                [
                    cardText
                ]
            ]
        },
        style: 'tableBody',
        margin: [0, 5]
    }

    return docDef
}

const getMultiCardDocDefinition = (cardTitle, subTitle1, cardText1, subTitle2, cardText2) => {
    const docDef = {
        table: {
            headerRows: 1,
            body: [
                [
                    cardTitle
                ],
                [
                    subTitle1
                ],
                [
                    cardText1
                ],
                [
                    subTitle2
                ],
                [
                    cardText2
                ]
            ]
        },
        style: 'tableBody',
        margin: [0, 5]
    }

    return docDef
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