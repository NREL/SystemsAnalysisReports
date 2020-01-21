import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

export class PeakConditionsCard extends React.Component {
    render() {
        return (
            <Card>
            <Card.Body className="App-textbox">
                <Container>
                    <Row>
                        <p><b>Conditions at Time of Peak</b></p>
                    </Row>
                    <Row>
                        <Col>
                            <p>Outside</p>
                            <p>DB: </p>
                            <p>WB: </p>
                            <p>HR: </p>
                        </Col>
                        <Col>
                            <p>Outside</p>
                            <p>DB: </p>
                            <p>WB: </p>
                            <p>HR: </p>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
            </Card>
        );
    }
}