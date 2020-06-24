import React, { useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { bisect, extent, max, min } from 'd3-array';
import { initReactI18next } from 'react-i18next';
var psychrolib = require('../lib/psychrolib');


// FINISH THE CODE FOR THE MINIMUM CONSTANT DB LINE.  THEN ADD STATE POINTS FROM DATA TO CHART

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

function lineSegmentIntersection(p11, p12, p21, p22) {
  const s1_x = p12.x - p11.x
  const s1_y = p12.y - p11.y
  const s2_x = p22.x - p21.x
  const s2_y = p22.y - p21.y
  
  const s = (-s1_y * (p11.x - p21.x) + s1_x * (p11.y - p21.y)) / (-s2_x * s1_y + s1_x * s2_y)
  const t = ( s2_x * (p11.y - p21.y) - s2_y * (p11.x - p21.x)) / (-s2_x * s1_y + s1_x * s2_y)
  
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Point of intersecdtion
    return {x: p11.x + (t * s1_x), y: p11.y + (t * s1_y)}
  } else {
    return null
  }
}

function lineIntersection(xLabel, yLabel, line1, line2) {
    for (var i  = 0; i < line1.length-1; i++) {
        for (var j = 0; j < line2.length-1; j++) {
            const intersectPoint = lineSegmentIntersection(
                {x: line1[i][xLabel], y: line1[i][yLabel]},
                {x: line1[i+1][xLabel], y: line1[i+1][yLabel]},
                {x: line2[i][xLabel], y: line2[i][yLabel]},
                {x: line2[i+1][xLabel], y: line2[i+1][yLabel]},
                );
            if (intersectPoint) {
                return intersectPoint;
            }
        }
    }

}

function filterPointsLessThan(pointLabel, pointArray, intersectionLabel, intersectionPoint) {
    let newArray = [];

    for (var i = 0; i < pointArray.length; i++) {
        if(pointArray[i][pointLabel] >= intersectionPoint[intersectionLabel]) {
            newArray.push(pointArray[i]);
        }
    }

    return newArray
}

function filterPointsGreaterThan(pointLabel, pointArray, intersectionLabel, intersectionPoint) {
    let newArray = [];

    for (var i = 0; i < pointArray.length; i++) {
        if(pointArray[i][pointLabel] <= intersectionPoint[intersectionLabel]) {
            newArray.push(pointArray[i]);
        }
    }

    return newArray
}


export const PsychrometricChart = (props) => {
    const { d3Container } = props;
    const data = [{x:10, y:0.0001}, {x:20, y:0.004}, {x:50, y:0.008}];
    const xMin = 0;
    const xMax = 50;
    const yMin = 0;
    const yMax = 0.03;

    useEffect(
        () => {
        
        // Set unit system - this needs to be done only once

        psychrolib.SetUnitSystem(psychrolib.SI)
        const Pressure = 101325;
        const TDryBulbArray = range(xMin, xMax+1, 1);
        
        // set the dimensions and margins of the graph
        var margin = {top: 40, right: 40, bottom: 40, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = scaleLinear()
                .domain([xMin, xMax])
                .range([0, width]);
        var y = scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);
        
        const svg = select(d3Container.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function(d) {
        d.y = +d.y;
        });

        // Max humid ratio line
        var MaxHumidRatioArray = [];
        TDryBulbArray.forEach(TDryBulb => {
            MaxHumidRatioArray.push({db: TDryBulb, w: yMax});
        })

        // Min dry bulb temperature line
        var MinTDryBulbArray = [];
        MaxHumidRatioArray.forEach(HumidRatio => {
            MinTDryBulbArray.push({db: xMin, w: HumidRatio});
        })

        // Saturation line
        var SaturationArray = [];
        TDryBulbArray.forEach(TDryBulb => {
            SaturationArray.push({db: TDryBulb, w: psychrolib.GetHumRatioFromRelHum(TDryBulb, 1.0, Pressure)});
        })

        // Add constant relative humidity lines
        const RelHumArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

        RelHumArray.forEach(RelHum => {
            let HumRatioArray = [];
            TDryBulbArray.forEach(TDryBulb => {
                HumRatioArray.push({db: TDryBulb, w: psychrolib.GetHumRatioFromRelHum(TDryBulb, RelHum, Pressure)});
            })

            
            // Clip points above humidity ratio limit
            let intersectionPoint = lineIntersection( "db", "w", HumRatioArray, MaxHumidRatioArray);  // Determine intersection point
            if (intersectionPoint) {
                HumRatioArray = filterPointsGreaterThan("db", HumRatioArray, "x", intersectionPoint);  // Remove points beyond humidity ratio line
                HumRatioArray.push({db: intersectionPoint["x"], w: intersectionPoint["y"]}); // Add intersection point to array
            }

            svg.append("path")
            .datum(HumRatioArray)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 0.5)
            .attr("d", line()
            .x(function(d) { return x(d.db) })
            .y(function(d) { return y(d.w) })
            )

        });
        
        // Add constant enthalpy lines
        const MoistAirEnthalpyArray = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

        MoistAirEnthalpyArray.forEach(MoistAirEnthalpy => {
            let HumRatioArray = [];
            TDryBulbArray.forEach(TDryBulb => {
                HumRatioArray.push({db: TDryBulb, w: psychrolib.GetHumRatioFromEnthalpyAndTDryBulb(MoistAirEnthalpy*1000, TDryBulb, Pressure)});
            })

            // Clip points outside of saturation line
            let intersectionPoint = lineIntersection( "db", "w", HumRatioArray, SaturationArray);  // Determine intersection point
            if (intersectionPoint) {
                HumRatioArray = filterPointsLessThan("db", HumRatioArray, "x", intersectionPoint);  // Remove points beyond saturation line
                HumRatioArray.unshift({db: intersectionPoint["x"], w: intersectionPoint["y"]}); // Add intersection point to array
            }

            // Clip points above humidity ratio limit
            let redArray = JSON.parse(JSON.stringify(HumRatioArray));
            redArray.forEach((item) => item["w"] = 0.03);
            intersectionPoint = lineIntersection( "db", "w", HumRatioArray, redArray);  // Determine intersection point
            if (intersectionPoint) {
                HumRatioArray = filterPointsLessThan("db", HumRatioArray, "x", intersectionPoint);  // Remove points beyond humidity ratio line
                HumRatioArray.unshift({db: intersectionPoint["x"], w: intersectionPoint["y"]}); // Add intersection point to array
            }

            svg.append("path")
            .datum(HumRatioArray)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 0.5)
            .attr("d", line()
            .x(function(d) { return x(d.db) })
            .y(function(d) { return y(d.w) })
            )
        });
        
        // Clip points at max humidity ratio beyond saturation line
        let MaxHumidLine = JSON.parse(JSON.stringify(MaxHumidRatioArray));
        let intersectionPoint = lineIntersection( "db", "w", SaturationArray, MaxHumidRatioArray);  // Determine intersection point

        if (intersectionPoint) {
            MaxHumidLine = filterPointsLessThan("db", MaxHumidRatioArray, "x", intersectionPoint);  // Remove points beyond humidity ratio line
            MaxHumidLine.unshift({db: intersectionPoint["x"], w: intersectionPoint["y"]}); // Add intersection point to array
        }

        // Draw max humidity ratio line
        svg.append("path")
        .datum(MaxHumidLine)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 0.5)
        .attr("d", line()
        .x(function(d) { return x(d.db) })
        .y(function(d) { return y(d.w) })
        )

        // Clip points at min dryb bulb temperature beyond saturation line
        let MinTDryBulbLine = JSON.parse(JSON.stringify(MinTDryBulbArray));
        intersectionPoint = lineIntersection( "db", "w", SaturationArray, MinTDryBulbArray);  // Determine intersection point

        if (intersectionPoint) {
            MinTDryBulbLine = filterPointsLessThan("db", MinTDryBulbArray, "x", intersectionPoint);  // Remove points beyond humidity ratio line
            MinTDryBulbLine.unshift({db: intersectionPoint["x"], w: intersectionPoint["y"]}); // Add intersection point to array
        }

        console.log(MinTDryBulbLine)

        // Draw min dry bulb tempeature line
        svg.append("path")
        .datum(MinTDryBulbLine)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 0.5)
        .attr("d", line()
        .x(function(d) { return x(d.db) })
        .y(function(d) { return y(d.w) })
        )

        // Add the data line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )
          
        /*
        // Add point data
        svg.selectAll('.point')
        .data([arrayOfPoints])
        .enter().append('circle')
        //.call(drag)
        .attr("class", "point")
        .attr("r", 4)
        .attr("cx", function(p) { return x(p.x); })
        .attr("cy", function(p) { return y(p.y); });
        */

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisBottom(x));

        // add the y Axis
        svg.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(axisRight(y));

    },[data, d3Container.current])

    return (
        <svg
            className="d3-component"
            width={300}
            height={200}
            ref={d3Container}
        />
    )
}