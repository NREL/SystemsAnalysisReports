import React from 'react';

export class DesignPsychrometrics extends React.Component {

    render() {
        const data = this.props.data[0];

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