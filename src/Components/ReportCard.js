import React from 'react';
import './ReportCard.css';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { formatUnitLabels } from '../functions/textFunctions';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { Translation } from 'react-i18next';

export class ReportCard extends React.Component {
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

    formatTextLine = (name, jsonKey, displayNames, dataValue, unitLabel) => {
        const lineLimit = 25;

        if (displayNames && dataValue) {
            var dataUnitStr = dataValue + ' ' + unitLabel;
            var dataUnitStrLen = dataUnitStr.length;
            var displayNameStrLen = Math.max.apply(Math, displayNames.map(function (el) { return el.length }));
            var totalStrLen = dataUnitStrLen + displayNameStrLen;

            if (totalStrLen < lineLimit) {
                return (
                    <div className='Report-card-item'>
                    <span key={ name + '-' + jsonKey }>
                        {displayNames.map((displayNameItem) => (
                            <span>{ displayNameItem }</span>
                        ))}
                    </span>
                    <b><span style={{paddingLeft: "12px"}}>
                        { dataValue } { unitLabel && unitLabel }
                    </span></b>
                    </div>
                )
            } else {
                return (
                    <div className='Report-card-item'>
                    <p key={ name + '-' + jsonKey }>
                        {displayNames.map((displayNameItem) => (
                            <p>{ displayNameItem }</p>
                        ))}
                    </p>
                    <b><p>
                        { dataValue } { unitLabel && unitLabel }
                    </p></b>
                    </div>
                )
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
                        <div className="Report-card" id={name}>
                            <div className="Report-card-header">{t(ns+":"+this.props.title)}</div>
                            <div className="Report-card-body">
                                <div>
                                    {dataMapping.map((colData, index) => (
                                        <div key={ this.props.name + '-' + index.toString() }>
                                            { this.formatTextLabel(t, ns, colData["Label"]) }
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

                                                return (
                                                    <div>{ this.formatTextLine(cardName, jsonKey, displayNames, dataValue, unitLabel) }</div>
                                                )}
                                            )}
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