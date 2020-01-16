import React from 'react';
import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

export class MyRadialBarChart extends React.Component {
    render() {
        const { xDataKey, yDataKey, data } = this.props;

        return (
            <RadialBarChart 
            width={500} 
            height={250} 
            innerRadius="10%" 
            outerRadius="80%" 
            data={data} 
            startAngle={180} 
            endAngle={0}
            >
            <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='total' />
            <Legend iconSize={8} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
            <Tooltip />
            </RadialBarChart>
        );
    }
}