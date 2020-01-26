import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

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
                            { colData["items"].map((item) => <p key={ this.props.name + '-' + item["jsonKey"] }>{ item["displayName"] } : { data[item["jsonKey"]] } { item["unitLabel"] && item["unitLabel"] }</p> ) }
                        </Col>
                    ))}
                </Container>
            </Card.Body>
            </Card>
        );
    }
}