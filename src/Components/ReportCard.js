import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import './ReportCard.css';
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { formatUnitLabels } from '../functions/textFunctions';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';
import { Translation } from 'react-i18next';

export class ReportCard extends React.Component {
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
                                            { colData["label"] ? <p><b>{ t(ns+":"+colData["label"]) }</b></p> : null }
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

                                                return (
                                                    <div>
                                                        <p key={ this.props.name + '-' + item["jsonKey"] }>
                                                            { t(ns+":"+item["displayName"]) }: 
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