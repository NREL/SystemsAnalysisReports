import React from 'react';
import './ReportCard.css';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { formatUnitLabels } from '../functions/textFunctions';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { Translation } from 'react-i18next';

export class ReportCard extends React.Component {
    getLabel = (t, ns, labelValue) => {
        if (labelValue) {
            const labelStr = t(ns+":"+labelValue)
            const labelLen = labelStr.length;
            return <p><b>{ labelStr }</b></p>
        } else {
            return null
        }
    }

    getDisplayName = (t, ns, displayName) => {
        const lineWidth = 30;

        if (displayName) {
            var labelStr = t(ns+":"+displayName)
            const labelLen = labelStr.length;

            console.log(labelStr);
            console.log(labelLen);
            console.log(lineWidth);

            if (labelLen > lineWidth) {
                const strArray = labelStr.split(" ");
                
                var finalArray = [strArray[0]];
                var lineInd = 0;
                for (var i = 1; i < strArray.length; i++) {
                    console.log(lineInd);
                    console.log(finalArray[lineInd]);
                    var newLineStr = (finalArray[lineInd] + " " + strArray[i]);
                    var newLineLen = newLineStr.length;
                    if (newLineLen < lineWidth) {
                        finalArray[lineInd] = newLineStr;
                    } else {
                        lineInd += 1;
                        finalArray[lineInd] = strArray[i];
                    }
                }

                //console.log(finalArray[lineInd]);
                console.log('-----------------');

                return finalArray

            } else {
                return [labelStr]
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
                                            { this.getLabel(t, ns, colData["Label"]) }
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
                                                const unitLabel = formatUnitLabels(getUnitLabel(this.props.unitSystem, item["type"], t));

                                                const displayNames = this.getDisplayName(t, ns, item["displayName"]);

                                                return (
                                                    <div>
                                                        <p key={ this.props.name + '-' + item["jsonKey"] }>
                                                            {displayNames.map((displayNameItem) => (
                                                                <b><p>{ displayNameItem }</p></b>
                                                            ))}
                                                        </p>
                                                        <p>
                                                            { dataValue } { unitLabel && unitLabel }
                                                        </p>
                                                    </div>
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