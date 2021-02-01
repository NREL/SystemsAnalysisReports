import React, { useContext } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Context } from '../store/index';
import './PieChart.css';
import { Translation } from 'react-i18next';

const RADIAN = Math.PI / 180;

export function CustomPieChart(props) {
    const { name, title, colors, data, pdfRef, isHidden, ns, id } = props;

    const { 
        animationEnable,
        pdfPrint
    } = useContext(Context);

    const renderCustomizedLabel = ({
        cx, cy, midAngle, outerRadius, value, index,
      }) => {
        const radius = outerRadius * 1.35;
        const labelAngle = midAngle;
        const x = cx + radius * Math.cos(-labelAngle * RADIAN);
        const y = cy + radius * Math.sin(-labelAngle * RADIAN);

        return (
          <text
          x={x}
          y={y}
          fill="black"
          style={{ fontSize: "10px"}}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          >
            {`${(value).toFixed(0)}`}
          </text>
        );
      };

    const displayStyle = (isHidden) => {
        if (isHidden) {
            return {display: "none", textAlign: "center"}
        } else {
            return {display: "block", textAlign: "center"}
        }
    }

    
    const renderLegendText = (ns, value) => {
        // Sets the legend font size     
      return <Translation>
          {
              (t) => <p className="pie-chart-legend-text">{t(ns+":"+value)}</p>
          }
      </Translation>;
    }

    const renderLegend = (ns, data, colors) => {

        var legendArray = [];
        for (var i = 0; i < data.length; i++) {
            legendArray.push(
                <div className="pie-chart-legend-item">
                    <svg width="16" height="16">
                    <rect
                        x="0"
                        y="0"
                        width="16"
                        height="16"
                        fill={colors[i]}
                    />
                    </svg> 
                    {renderLegendText(ns, data[i].name)}
                </div>
            )
        }

        return legendArray;
    }

    const renderPrintLegend = (value, entry, index) => {
        return <Translation>
            {
                (t) => <span>{t(ns+":"+value)}</span>
            }
        </Translation>;
    }

    const width = 220;
    const height = 168;

    if (pdfPrint) {
        return (
            <div ref={pdfRef} id={id} className="App-chart-container-print" style={displayStyle(isHidden)}>
                <div className="App-chart-title-print">{title}</div>
                <div className="pie-chart-container-print">
                    <PieChart width={width} height={height}>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx={width/2}
                            cy={(height)/2}
                            innerRadius={0}
                            outerRadius={(width-40)/3.25}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
                            isAnimationActive ={animationEnable}
                            height={height}
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
                        <Legend align="center" wrapperStyle={{position:"relative", width:240}} formatter={renderPrintLegend}/>
                    </PieChart>
                </div>
            </div>
        )
    } else {
        return (
            <div className="App-chart-container" style={displayStyle(isHidden)}>
                <div className="App-chart-title">{title}</div>
                <div className="pie-chart-container">
                    <PieChart width={width} height={height}>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx={width/2}
                            cy={height/2}
                            innerRadius={0}
                            outerRadius={(width-40)/3.25}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
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
                    </PieChart>
                    <div>
                        {renderLegend(ns, data, colors)}
                    </div>
                </div>
            </div>
        );
    }

}