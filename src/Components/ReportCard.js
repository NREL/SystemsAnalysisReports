import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import './ReportCard.css';
import { formatUnitLabels } from '../functions/textFunctions';
import { isNumeric, numberWithCommas } from '../functions/numericFunctions';

export class ReportCard extends React.Component {
    render() {
        var { data, dataMapping } = this.props;
        return (
            <Card className="App-card">
            <Card.Header className="App-card-header">{this.props.title}</Card.Header>
            <Card.Body className="App-card-body">
                <Container>
                    {dataMapping.map((colData, index) => (
                            <Col key={ this.props.name + '-' + index.toString() }>
                                { colData["label"] && <p><b>{ colData["label"] }</b></p> }
                                { colData["items"].map((item) => {
                                    var dataValue = null;
                                    var decimals = 1;

                                    // Truncate numeric value based on desired decimals
                                    if (Object.keys(item).includes('decimals')) {
                                        decimals = item['decimals'];
                                    }
                                    
                                    if (data) {
                                        if ( isNumeric(data[item["jsonKey"]]) ) {
                                            // Set value to display with decimal value truncation
                                            dataValue = numberWithCommas(data[item["jsonKey"]].toFixed(decimals));
                                        } else {
                                            // Set value to null if none exists in data
                                            dataValue = data[item["jsonKey"]];
                                        }
                                    } else {
                                        dataValue = null
                                    }
                                    
                                    // Set formatting for the unit labels
                                    const unitLabel = formatUnitLabels(item["unitLabel"]);

                                    return (
                                        <p key={ this.props.name + '-' + item["jsonKey"] }>
                                            { item["displayName"] } : { dataValue } { unitLabel && unitLabel }
                                        </p>
                                    )} 
                                )}
                            </Col>
                    ))}
                </Container>
            </Card.Body>
            </Card>
        );
    }
}