import React, { useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';
import { useTranslation } from "react-i18next";
import { convertDataUnit, getUnitLabel } from '../functions/dataFormatting';
import { filterPointsGreaterThan, filterPointsLessThan, range } from '../functions/numericFunctions';
import { lineIntersection } from '../functions/geometricFunctions';
import './PsychrometricChart.css';
var psychrolib = require('../lib/psychrolib.js');

export const PsychrometricChart = (props) => {
    const { d3Container, unitSystem, animationEnable, data, dataMapping, ns } = props;
    const { t } = useTranslation();

    // Set unit system to use for psych chart
    // Use IP units for 'Revit' and selected unit system for all else
    const psychUnitSystem = ( (unitSystem === 'revit') ? 'ip' : unitSystem );

    // Chart titles
    const xAxisTitle = t(ns+":"+'Dry Bulb Temperature') + ' [' + getUnitLabel(psychUnitSystem, 'temperature', t) + ']';
    const yAxisTitle = t(ns+":"+'Humidity Ratio') + ' [' + getUnitLabel(psychUnitSystem, 'humidity_ratio', t) + ']';

    // Atmospheric pressure
    var Pressure = convertDataUnit(psychUnitSystem, 'pressure', ( data['summary']['atmospheric_pressure'] ? data['summary']['atmospheric_pressure'] : 101325 ));

    // Initialize chart limits
    const xMin = ( psychUnitSystem === 'si' ? 0 : 30); 
    const xMax = ( psychUnitSystem === 'si' ? 50 : 120); 
    const yMin = 0.0
    const yMax = 0.03;

    // set the dimensions and margins of the graph
    var margin = {top: 16, right: 24, bottom: 100, left: 0},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    useEffect(() => {

        // Transition for d3 animation
        const t1 = ( animationEnable ? transition().duration(1000) : transition().duration(0)) ;

        // Set unit system - this needs to be done only once
        if (psychUnitSystem === 'si') {
            psychrolib.SetUnitSystem(psychrolib.SI)
        } else if (unitSystem === 'ip') {
            psychrolib.SetUnitSystem(psychrolib.IP)
        } else {
            psychrolib.SetUnitSystem(psychrolib.IP)
        }

        // Constants and axes parameter ranges
        const TDryBulbRange = range(xMin, xMax+1, 1);
        let HumidRatioRange = range(yMin*1000, yMax*1000+1, 1);
        HumidRatioRange.forEach((HumidRatio, i) => {
            HumidRatioRange[i] = HumidRatio/1000;
        })

        // Set scales
        var x = scaleLinear()
                .domain([xMin, xMax])
                .range([0, width]);
        var y = scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);
        
        // Clear existing svg object
        select(d3Container.current).selectAll("*").remove();

        // Initialize svg object
        const svg = select(d3Container.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

        // Max humid ratio line array 
        var MaxHumidRatioArray = [];
        TDryBulbRange.forEach(TDryBulb => {
            MaxHumidRatioArray.push({db: TDryBulb, w: yMax});
        })

        // Saturation line array
        var SaturationArray = [];
        TDryBulbRange.forEach(TDryBulb => {
            SaturationArray.push({db: TDryBulb, w: psychrolib.GetHumRatioFromRelHum(TDryBulb, 1.0, Pressure)});
        })

        // Draw psychrometric chart lines
        addConstantRelativeHumidityLines(svg, x, y, Pressure, TDryBulbRange, MaxHumidRatioArray);
        addConstantEnthalpyLines(psychUnitSystem, svg, x, y, Pressure, TDryBulbRange, SaturationArray);
        addMaxHumidityRatioLine(svg, x, y, MaxHumidRatioArray, SaturationArray);
        addMinDryBulbTemperatureLine(svg, x, y, xMin, HumidRatioRange, SaturationArray);
        
        // Draw process points and lines
        addSystemProcessLines(svg, x, y, t1, data);
        addSystemStatePoints(svg, x, y, data);

        // Draw legend
        addLegend(svg, width, height, margin, data, t);

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisBottom(x));

          // text label for the x axis
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(xAxisTitle);

        // add the y Axis
        svg.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(axisRight(y));

        // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.left + 20)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisTitle); 
    },[unitSystem, t, animationEnable, data, d3Container.current])

    const addConstantRelativeHumidityLines = (svg, x, y, Pressure, TDryBulbRange, MaxHumidRatioArray) => {
        // Add constant relative humidity lines
        const RelHumArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

        RelHumArray.forEach(RelHum => {
            let HumRatioArray = [];
            TDryBulbRange.forEach(TDryBulb => {
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
    }

    const addConstantEnthalpyLines = (unitSystem, svg, x, y, Pressure, TDryBulbRange, SaturationArray) => {
        // Add constant enthalpy lines
        const MoistAirEnthalpyArray = convertDataUnit(unitSystem, 'enthalpy', [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]); //Enthalpy [kJ/kg]

        MoistAirEnthalpyArray.forEach(MoistAirEnthalpy => {
            let HumRatioArray = [];
            TDryBulbRange.forEach(TDryBulb => {
                let enthalpy = convertDataUnit(unitSystem, 'enthalpy', MoistAirEnthalpy);
                if (unitSystem === 'si') { enthalpy = enthalpy*1000;}
                HumRatioArray.push({db: TDryBulb, w: psychrolib.GetHumRatioFromEnthalpyAndTDryBulb(enthalpy, TDryBulb, Pressure)});
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
    }

    const addMaxHumidityRatioLine = (svg, x, y, MaxHumidRatioArray, SaturationArray) => {
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
    }

    const addMinDryBulbTemperatureLine = (svg, x, y, minTDryBulb, HumidRatioRange, SaturationArray) => {
        let MinTDryBulbLine = [];

        // Determine the humidity ratio at saturation and minimum dry bulb temperature
        let humidRatioAtMinTDryBulbSaturation = SaturationArray[0]["w"];

        // Create array of points at min dry bulb temperature up to saturation line
        HumidRatioRange.forEach(item => {
            if (item <= humidRatioAtMinTDryBulbSaturation) {
                MinTDryBulbLine.push({db: minTDryBulb, w: item})
            }
        })
        MinTDryBulbLine.push({db: minTDryBulb, w: humidRatioAtMinTDryBulbSaturation}); 

        // Draw min dry bulb tempeature line
        svg.append("path")
        .datum(MinTDryBulbLine)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 0.5)
        .attr("d", line()
        .x(function(d) { return x(d.db) })
        .y(function(d) { return y(d.w) })
        );
    }

    const addSystemProcessLines = (svg, x, y, t1, data) => {
        let systemProcesses = [];

        // Pair of points to plot as process lines
        const lineLabelPairs = [
            ["zone", "return_air"],
            ["outdoor_air", "entering_coil"],
            ["return_air", "entering_coil"],
            ["entering_coil", "leaving_coil"],
            ["leaving_coil", "zone"]
        ];

        // Convert units for each temp and humidity point in data pair
        lineLabelPairs.forEach(pair => {
            systemProcesses.push([
                {
                    dry_bulb_temperature: convertDataUnit(psychUnitSystem, "temperature", data[pair[0]]["dry_bulb_temperature"]),
                    humidity_ratio: convertDataUnit(psychUnitSystem, "humidity_ratio", data[pair[0]]["humidity_ratio"])
                },
                {
                    dry_bulb_temperature: convertDataUnit(psychUnitSystem, "temperature", data[pair[1]]["dry_bulb_temperature"]),
                    humidity_ratio: convertDataUnit(psychUnitSystem, "humidity_ratio", data[pair[1]]["humidity_ratio"])
                }
            ]);
        });

        // Loop to create line segments for system process lines
        systemProcesses.forEach((systemProcess) => {
            // Add the data line
            svg.append("path")
            .datum(systemProcess)
            .transition(t1)
            .attr("class", "processLine")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line()
            .x(function(d) { return x(d.dry_bulb_temperature) })
            .y(function(d) { return y(d.humidity_ratio) })
            )
        })

    }

    const addSystemStatePoints = (svg, x, y, data) => {
        let statePoints = [];

        // Set up data for drawing the state points
        Object.entries(data).forEach(([systemName, statePoint]) => {

            // Get the display name for the row data
            Object.entries(dataMapping['rows']).forEach(([k, v]) => {
                if (v.jsonKey === systemName) {
                    // Add a data row
                    const Tdb = convertDataUnit(psychUnitSystem, 'temperature', data[v.jsonKey]['dry_bulb_temperature']);
                    const w = convertDataUnit(psychUnitSystem, 'humidity_ratio', data[v.jsonKey]['humidity_ratio']);
                    statePoints.push({ dry_bulb_temperature: Tdb, humidity_ratio: w });
                }
            })
        })

        // Add state point on chart
        svg.selectAll('.point')
        .data(statePoints)
        .enter().append('circle')
        .style('fill', function(d, i) { return schemeCategory10[i] })
        .attr("class", "statePoint")
        .attr("r", 6)
        .attr("cx", function(d) { return x(d.dry_bulb_temperature); })
        .attr("cy", function(d) { return y(d.humidity_ratio); });
    }

    const addLegend = (svg, width, height, margin, data, t) => {
        let legendEntries = [];
        let i = 0;

        // Set up data for legend
        Object.entries(data).forEach(([systemName, statePoint]) => {

            // Get the display name for the row data
            Object.entries(dataMapping['rows']).forEach(([k, v]) => {
                if (v.jsonKey === systemName) {
                    const yLocation = height + 70;
                    const xLocation = margin.left + 50 + i*100;

                    // Add a data row
                    legendEntries.push({name: t(ns+":"+v.displayName), x: xLocation, y: yLocation});

                    i++;
                }
            })
        })

        // Add point for legend entry
        svg.selectAll(".legendPoint")
        .data(legendEntries)
        .enter()
        .append('circle')
        .style('fill', function(d, i) { return schemeCategory10[i] })
        .attr("class", "legendPoint")
        .attr("r", 8)
        .attr("cx", function(d) { return d.x } )
        .attr("cy", function(d) { return d.y } );

        //Add text for legend entry
        svg.selectAll(".legendLabel")
        .data(legendEntries)
        .enter()
        .append("text")
        .attr("class", "legendLabel")
        .text( function (d) { return d.name; })
        .attr("x", function(d) { return (d.x + 15) } )
        .attr("y", function(d) { return (d.y + 4) } );
    }

    return (
        <svg
            className="d3-component"
            width={300}
            height={200}
            ref={d3Container}
        />
    )
}