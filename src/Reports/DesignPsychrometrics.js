import React from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { MyTable } from '../Components/Table';
import { CustomPieChart } from '../Components/PieChart';

export class DesignPsychrometrics extends React.Component {

    render() {
        const data = this.props.data[0];
        console.log(data);

        return (
            <div>
              <p>Air Density {data.air_density}</p>
              <p>Air Specific Heat  {data.air_specific_heat}</p>
              <p>OA Dry Bulb {data.oa_drybulb} C</p>
              <p>OA Flow Rate {data.oa_flow_rate} m3/s</p>
            </div>
        );
    }
}