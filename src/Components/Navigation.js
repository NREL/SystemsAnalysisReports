import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { LoadSummary } from '../Reports/LoadSummary';
import { DesignPsychrometrics } from '../Reports/DesignPsychrometrics';
import {
    designPsychrometricsMapping,
    zoneLoadSummaryMapping,
    systemLoadSummaryMapping
} from '../constants/dataMapping';
import { loadData, formatData } from '../functions/dataFormatting';

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navDisabled: true,
            loading: true,
            data: null
        };
    } 
    
    componentDidMount() {
    // Function to load data asyncronously
    loadData(this.props.data).then(data => {
        formatData(data).then(data => {
            this.setState({ navDisabled: false, loading: false, data: data })
        })
    })
    }

    loadData = () => new Promise((resolve, reject) => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(this.props.data))), 1);
      });

    render() {
        const { disabled, loading, data } = this.state;

        if(loading) { // if your component doesn't have to wait for an async action, remove this block 
            return(
                <Tab.Container id="report-navbar" defaultActiveKey="zone_load_summary">
                <Tab.Content className="App-content">
                <Tab.Pane eventKey="zone_load_summary">
                    <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                    </Spinner>
                </Tab.Pane>
                </Tab.Content>
                </Tab.Container>
            )
        } else {
            return(
                <Tab.Container id="report-navbar" defaultActiveKey="zone_load_summary">
                    <Row>
                        <Nav variant="tabs" className="App-navbar">
                            <Nav.Item background="black">
                                <Nav.Link eventKey="zone_load_summary" disabled={disabled}>
                                    Zone Load Summary
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="system_load_summary" disabled={disabled}>
                                    System Load Summary
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="design_psychrometrics" disabled={disabled}>
                                    Design Psychrometrics
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    <Row>                
                        <Tab.Content className="App-content">
                            <Tab.Pane eventKey="zone_load_summary">
                                <LoadSummary
                                name="zoneLoadSummary"
                                dataMapping={zoneLoadSummaryMapping}
                                data={data['zone_loads_by_components']}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="system_load_summary">
                                <LoadSummary
                                name="systemLoadSummary"
                                dataMapping={systemLoadSummaryMapping}
                                data={data['system_checksums']}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="design_psychrometrics">
                                <DesignPsychrometrics
                                name="designPsychrometrics"
                                dataMapping={designPsychrometricsMapping}
                                data={data['design_psychrometrics']}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Row>
                    </Tab.Container>
            );
        }
    }
}