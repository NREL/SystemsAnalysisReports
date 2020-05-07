import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { LoadSummary } from './Reports/LoadSummary';
import { DesignPsychrometrics } from './Reports/DesignPsychrometrics';import './App.css';
import {
  designPsychrometricsMapping,
  zoneLoadSummaryMapping,
  systemLoadSummaryMapping
} from './constants/dataMapping';
import { loadData, formatData } from './functions/dataFormatting';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        data: null,
        active_section: 'zone_load_summary',
        unit_system: 'si'
    };
  } 

  componentDidMount() {
      // Function to load data asyncronously
      loadData(this.props.data).then(data => {
          formatData(data).then(data => {
              this.setState({ loading: false, data: data })
          })
      })
  }

  handleSectionSelection(value) {
    if (this.state.data && value) {
        this.setState({ active_section: value }) 
    }
  }

  handleUnitSystemSelection(value) {
      if (value) {
          this.setState({ unit_system: value }) 
      }
  }

  renderActiveSection(value, data) {
    if (value === 'zone_load_summary') {
      return(
        <LoadSummary
        key="zoneLoadSummary"
        name="zoneLoadSummary"
        unitSystem={this.state.unit_system}
        dataMapping={zoneLoadSummaryMapping}
        data={data['zone_load_summarys']}
        />
    
      )
    } else if (value === 'system_load_summarys') {
      return(
        <LoadSummary
        key="systemLoadSummary"
        name="systemLoadSummary"
        unitSystem={this.state.unit_system}
        dataMapping={systemLoadSummaryMapping}
        data={data['system_load_summarys']}
        />
      )
    } else if (value === 'design_psychrometrics') {
      return(
        <DesignPsychrometrics
        key="designPsychrometrics"
        name="designPsychrometrics"
        unitSystem={this.state.unit_system}
        dataMapping={designPsychrometricsMapping}
        data={data['design_psychrometrics']}
        />
      )
    } else {
      return(
        <div>
            No Section Selected
        </div>
      )
    }
  } 

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
            <div className="App">
              <header className="App-header">
                <p>
                  Revit Systems Analysis - Loads Report
                </p>
              </header>
              <div className="navigation-container">
                  <Container fluid>
                  <Row>
                      <Col>
                          <Nav variant="tabs" defaultActiveKey="zone_load_summary" id="report-navbar" onSelect={this.handleSectionSelection.bind(this)}>
                          <Nav.Item>
                              <Nav.Link eventKey="zone_load_summary">Zone Load Summary</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                              <Nav.Link eventKey="system_load_summarys">System Load Summary</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                              <Nav.Link eventKey="design_psychrometrics">Design Psychrometrics</Nav.Link>
                          </Nav.Item>
                          </Nav>
                      </Col>
                      <Col lg={1}>
                          <Dropdown onSelect={this.handleUnitSystemSelection.bind(this)}>
                              <Dropdown.Toggle id="dropdown-unit-selection"  variant="info">
                              { this.state.unit_system === 'si' ? 'SI' : 'IP'  }
                              </Dropdown.Toggle>
              
                              <Dropdown.Menu>
                              <Dropdown.Item eventKey="ip">IP</Dropdown.Item>
                              <Dropdown.Item eventKey="si">SI</Dropdown.Item>
                              </Dropdown.Menu>
                          </Dropdown> 
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                        { this.renderActiveSection(this.state.active_section, data) }
                      </Col>
                  </Row>
                  </Container>
              </div>
            </div>
          );
      }
  }
}