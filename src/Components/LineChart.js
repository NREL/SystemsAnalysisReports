import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export class MyLineChart extends React.Component {
    render() {
        const { xDataKey, yDataKey, data } = this.props;

        return (
            <LineChart width={400} height={400} data={data}>
                <Line type="monotone" dataKey={yDataKey} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart>
        );
    }
}