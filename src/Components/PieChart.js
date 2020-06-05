import React, { useContext } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { Context } from '../store/index';
import './PieChart.css';

export function CustomPieChart(props) {
    const { name, title, colors, data, pdfRef } = props;
    
    const { 
        animationEnable,
    } = useContext(Context);

    const renderLegendText = (value, entry) => {
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
                    isAnimationActive ={animationEnable}
                >
                {
                    ( data ? data.map((entry, index) => (
                        <Cell
                        key={ name + '-' + index.toString()}
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