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

export class TabPanes extends React.Component {
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
    this.loadData().then(data => {
        this.formatData(data).then(data => {
            this.setState({ navDisabled: false, loading: false, data: data })
        })
    })
    }

    loadData = () => new Promise((resolve, reject) => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(this.props.data))), 1);
      });

    shiftReturnAirLoads(data) {
    // This function shifts the return air loads from lighting and equipment to new table rows "return_air_lighting" and "return_air_other"

    // Initialize new data objects
    data['return_air_lights'] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
        "total": 0.0,
        "percent_grand_total": 0.0
    };

    data["return_air_other"] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
        "total": 0.0,
        "percent_grand_total": 0.0
    };

    // Initialize total load
    var totalLoad = 0;

    // Loop for row in data
    Object.keys(data).map((rowName) => {
        const returnAirLoad = JSON.parse(JSON.stringify(data))[rowName]['sensible_return_air'];
        //const totalLoad = JSON.parse(JSON.stringify(data))[rowName]['total'];

        // If loads exist
        if (returnAirLoad > 0) {
        // Determine type of load (lighting or other)
        if ( rowName === 'lights') {
            // Lighting loads
            data["return_air_lights"]["sensible_instant"] = returnAirLoad;     
        } else {
            // Increment all other loads
            data["return_air_other"]["sensible_instant"] += returnAirLoad;                   
        }

        // Remove sensible_return air load and reduce total load
        data[rowName]["sensible_return_air"] = 0; 
        }

        // Recalculate total
        data[rowName]["total"] = 0
        data[rowName]["total"] += data[rowName]["sensible_instant"]
        data[rowName]["total"] += data[rowName]["sensible_delayed"]
        data[rowName]["total"] += data[rowName]["latent"]
        data[rowName]["total"] += data[rowName]["sensible_return_air"]
        totalLoad += data[rowName]["total"];  // Calculate the grand total
        
        return data
    })

    // Loop for percent grand total
    Object.keys(data).map((rowName) => {
        data[rowName]["percent_grand_total"] = (data[rowName]["total"]/totalLoad)*100.0;
        return data
    })

    return data
    }

    formatData = (data) => new Promise((resolve, reject) => {
        // This function formats the data that will be displayed in the table.
        var newData = data;

        // Adjust Zone Loads By Component
        newData['zone_loads_by_components'].map((loadObject) => {
            loadObject['cooling_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
            loadObject['heating_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);

            return loadObject;
        })

        // Adjust Systems Checksums
        newData['system_checksums'].map((loadObject) => {
            loadObject['cooling_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
            loadObject['heating_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);

            return loadObject;
        })

        resolve(newData);
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