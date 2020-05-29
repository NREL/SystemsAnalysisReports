import React from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import './PieChart.css';

export class CustomPieChart extends React.Component {
    render() {
        const { title, colors, data, pdfRef } = this.props;

        function renderLegendText(value, entry) {
            // Sets the legend font size     
          return <span style={{ fontSize: "12px" }}>{value}</span>;
        }
        
        return (
            <div className="App-chart-container" ref={pdfRef}>
                <span className="App-chart-title">{title}</span>
                <PieChart width={350} height={300}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx={170}
                        cy={125}
                        innerRadius={0}
                        outerRadius={90}
                        fill="#8884d8"
                        label
                        isAnimationActive ={false}
                    >
                    {
                        ( data ? data.map((entry, index) => (
                            <Cell
                            key={this.props.name + '-' + index.toString()}
                            fill={colors[index % colors.length]}
                            />
                        )) : null)
                    }
                    </Pie>
                    <Legend iconSize="12" formatter={renderLegendText}/>
                </PieChart>
            </div>
        );
    }
}