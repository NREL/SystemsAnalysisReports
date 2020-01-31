import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { LoadSummary } from '../Reports/LoadSummary';
import { DesignPsychrometrics } from '../Reports/DesignPsychrometrics';
import {
    zoneLoadSummaryMapping,
    systemLoadSummaryMapping
} from '../constants/dataMapping';

export class Navbar extends React.Component {
    render() {
        return (
            <Tab.Container id="report-navbar" defaultActiveKey="zone_load_summary">
            <Row>
                <Nav variant="tabs" className="App-navbar">
                    <Nav.Item background="black">
                        <Nav.Link eventKey="zone_load_summary">
                            Zone Load Summary
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="system_load_summary">
                            System Load Summary
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="design_psychrometrics">
                            Design Psychrometrics
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row>
                <Tab.Content className="App-content">
                    <Tab.Pane eventKey="zone_load_summary">
                        <LoadSummary name="zoneLoadSummary" dataMapping={zoneLoadSummaryMapping} data={this.props.data['zone_loads_by_components']}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="system_load_summary">
                        <LoadSummary name="systemLoadSummary" dataMapping={systemLoadSummaryMapping} data={this.props.data['system_checksums']}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="design_psychrometrics">
                        <DesignPsychrometrics name="designPsychrometrics" data={this.props.data['design_psychrometrics']}/>
                    </Tab.Pane>
                </Tab.Content>
            </Row>
            </Tab.Container>
        )
    }
}