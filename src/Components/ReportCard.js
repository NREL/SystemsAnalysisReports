import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

export class ReportCard extends React.Component {
    render() {
        var { data, dataMapping } = this.props;
        return (
            <Card className="App-card">
            <Card.Header className="App-card-header">{this.props.title}</Card.Header>
            <Card.Body className="App-card-body">
                <Container>
                    <Row>
                        {dataMapping.map((colData) => (
                            <Col>
                                { colData["label"] && <p><b>{ colData["label"] }</b></p> }
                                { colData["items"].map((item) => <p>{ item["displayName"] }: { data[item["jsonKey"]] } { item["unitLabel"] && item["unitLabel"] }</p> ) }
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Card.Body>
            </Card>
        );
    }
}