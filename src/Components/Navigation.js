import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LoadSummary } from '../Reports/LoadSummary';
import { DesignPsychrometrics } from '../Reports/DesignPsychrometrics';
import './Navigation.css';
import {
    designPsychrometricsMapping,
    zoneLoadSummaryMapping,
    systemLoadSummaryMapping
} from '../constants/dataMapping';
import { loadData } from '../functions/dataFormatting';

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: null
        };
    } 
    
    componentDidMount() {
    // Function to load data asyncronously
    loadData(this.props.data).then(data => {
        this.setState({ loading: false, data: data })
    })
    }

    loadData = () => new Promise((resolve, reject) => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(this.props.data))), 1);
      });

    render() {
        const { loading, data } = this.state;

        if(loading) { // if your component doesn't have to wait for an async action, remove this block 
            return(
                <div className="navigation-container">
                    <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )
        } else {
            return(
                <div className="navigation-container">
                    <Tabs defaultActiveKey="zone_load_summary" id="report-navbar">
                    <Tab eventKey="zone_load_summary" title="Zone Load Summary">
                    <LoadSummary
                        name="zoneLoadSummary"
                        dataMapping={zoneLoadSummaryMapping}
                        data={data['zone_load_summarys']}
                        />
                    </Tab>
                    <Tab eventKey="system_load_summarys" title="System Load Summary">
                    <LoadSummary
                        name="systemLoadSummary"
                        dataMapping={systemLoadSummaryMapping}
                        data={data['system_load_summarys']}
                        />
                    </Tab>
                    <Tab eventKey="design_psychrometrics" title="Design Psychrometrics">
                    <DesignPsychrometrics
                        name="designPsychrometrics"
                        dataMapping={designPsychrometricsMapping}
                        data={data['design_psychrometrics']}
                        />
                    </Tab>
                </Tabs>
              </div>
            );
        }
    }
}