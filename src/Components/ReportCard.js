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
                        <Card className="App-card" id={name}>
                            <Card.Header className="App-card-header">{this.props.title}</Card.Header>
                            <Card.Body className="App-card-body">
                                <Container>
                                    {dataMapping.map((colData, index) => (
                                        <Col key={ this.props.name + '-' + index.toString() }>
                                            { colData["label"] && <p><b>{ t(ns+":"+colData["label"]) }</b></p> }
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
                                                const unitLabel = formatUnitLabels(getUnitLabel(this.props.unitSystem, item["type"]));

                                                return (
                                                    <p key={ this.props.name + '-' + item["jsonKey"] }>
                                                        { t(ns+":"+item["displayName"]) } : { dataValue } { unitLabel && unitLabel }
                                                    </p>
                                                )}
                                            )}
                                        </Col>
                                    ))}
                                </Container>
                            </Card.Body>
                        </Card>
                }
            </Translation>
        );
    }
}