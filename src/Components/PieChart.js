import React from 'react';
import { Cell, Legend, Pie, PieChart, Sector } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#DD4132', '#9E1030', '#FE840E', '#C62168'];

export class CustomPieChart extends React.Component {
    render() {
        const { data } = this.props;

        return (
            <PieChart width={400} height={400}>
            <Pie
                data={data}
                dataKey="total"
                cx={200}
                cy={200}
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                label
            >
            {
                data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
            }
            </Pie>
            <Legend/>
            </PieChart>
        );
    }
}