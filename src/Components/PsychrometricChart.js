import React, { useEffect } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
var psychrolib = require('../lib/psychrolib');

export const PsychrometricChart = (props) => {
    const { d3Container } = props;
    const data = [{x:1, y:2}, {x:2, y:4}, {x:3, y:6}];

    useEffect(
        () => {
        
        // Set unit system - this needs to be done only once
        console.log(psychrolib);
        psychrolib.SetUnitSystem(psychrolib.SI)
        var TDewPoint = psychrolib.GetTDewPointFromRelHum(25.0, 0.80);
        console.log('TDewPoint: %d degree C', TDewPoint);
        
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = scaleBand()
                .range([0, width])
                .padding(0.1);
        var y = scaleLinear()
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

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.x; }));
        y.domain([0, max(data, function(d) { return d.y; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisBottom(x));

        // add the y Axis
        svg.append("g")
        .call(axisLeft(y));

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