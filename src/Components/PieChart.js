import React, { useContext } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { Context } from '../store/index';
import './PieChart.css';
import { Translation } from 'react-i18next';

export function CustomPieChart(props) {
    const { name, title, colors, data, pdfRef, legendRef, isHidden, ns } = props;
    
    const { 
        animationEnable,
    } = useContext(Context);

    const renderLegendText = (value, entry) => {
        // Sets the legend font size     
      return <Translation>
          {
              (t) => <span style={{ fontSize: "12px", display: "inline-block" }}>{t(ns+":"+value)}</span>
          }
      </Translation>;
    }

    const displayStyle = (isHidden) => {
        if (isHidden) {
            return {display: "none", textAlign: "center"}
        } else {
            return {display: "block", textAlign: "center"}
        }
    }

    return (
        <div ref={pdfRef} className="App-chart-container" style={displayStyle(isHidden)}>
            <span className="App-chart-title">{title}</span>
            <PieChart width={350} height={300} >
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
                <Legend
                    width={350}
                    iconSize="14"
                    align="center"
                    formatter={renderLegendText}
                />
            </PieChart>
        </div>
    );
}