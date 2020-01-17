import React from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#DD4132', '#9E1030', '#FE840E', '#C62168'];
const COLORS = ["#003f5c","#374c80","#7a5195","#bc5090","#ef5675","#ff764a","#ffa600"];  // Equidistant purple to yellow (https://learnui.design/tools/data-color-picker.html)
//const COLORS = ["#5A374A","#5C5571","#4A768F","#329899","#4DB68D","#90CF75","#E2E063"]; //(http://tristen.ca/hcl-picker/#/hlc/7/0.99/5A374A/E2E063)

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
                innerRadius={0}
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