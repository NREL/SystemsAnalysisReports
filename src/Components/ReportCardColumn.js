import React from 'react';
import './ReportCardColumn.css';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { formatUnitLabels } from '../functions/textFunctions';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { Translation } from 'react-i18next';

export class ReportCardColumn extends React.Component {
    formatTextLabel = (t, ns, labelValue) => {
        const lineWidth = 30;

        if (labelValue) {
            var labelStr = t(ns+":"+labelValue)
            const labelLen = labelStr.length;

            if (labelLen > lineWidth) {
                const strArray = labelStr.split(" ");

                var finalArray = [strArray[0]];
                var lineInd = 0;
                for (var i = 1; i < strArray.length; i++) {
                    var newLineStr = (finalArray[lineInd] + " " + strArray[i]);
                    var newLineLen = newLineStr.length;
                    if (newLineLen < lineWidth) {
                        finalArray[lineInd] = newLineStr;
                    } else {
                        lineInd += 1;
                        finalArray[lineInd] = strArray[i];
                    }
                }
                finalArray[-1] += ":"

                return finalArray

            } else {
                return [labelStr]// + ":"]
            }
        } else {
            return null
        }
    }

    render() {
        var { data, dataMapping, name, ns } = this.props;
        return (
            <Translation>
                {
                    (t) =>
                        <div className="Report-card-column" id={name}>
                            <div className="Report-card-column-header">{t(ns+":"+this.props.title)}</div>
                            <div className="Report-card-column-body">
                                <div>
                                    {dataMapping.map((colData, index) => (
                                        <div key={ this.props.name + '-' + index.toString() }>
                                            {colData["label"] ? <div className="Report-card-column-label">{ this.formatTextLabel(t, ns, colData["label"]) }</div> : null }
                                            <table>
                                                { colData["items"].map((item) => {
                                                    var dataValue = null;

                                                    if (data) {
                                                        if ( isNumeric(data[item["jsonKey"]]) ) {
                                                            // convert unit system
                                                            dataValue = convertDataUnit(this.props.unitSystem, item["type"], data[item["jsonKey"]])

                                                            // Set value to display as number with commas
                                                            dataValue = numberWithCommas(dataValue);
                                                        } else {
                                                            // Set value to null if none exists in data
                                                            dataValue = data[item["jsonKey"]];
                                                        }
                                                    } else {
                                                        dataValue = null
                                                    }

                                                    // Set formatting for the unit labels
                                                    const cardName = this.props.name;
                                                    const jsonKey = item["jsonKey"];
                                                    const unitLabel = formatUnitLabels(getUnitLabel(this.props.unitSystem, item["type"], t));
                                                    const displayNames = this.formatTextLabel(t, ns, item["displayName"]);

                                                    return(
                                                    <tr className="Report-card-column-row">
                                                        <td className="Report-card-table-label">{this.formatTextLabel(t, ns, item["displayName"])}:</td>
                                                        <td className="Report-card-table-value">
                                                            { dataValue } { unitLabel && unitLabel }
                                                        </td>
                                                    </tr>
                                                        // <div>{ this.formatTextLine(cardName, jsonKey, displayNames, dataValue, unitLabel) }</div>
                                                    )}
                                                )}
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                }
            </Translation>
        );
    }
}