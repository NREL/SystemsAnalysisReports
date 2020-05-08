export default {
    si: {
        heat_transfer_rate: {conversion: null, label: 'W', decimals: 0},
        temperature: {conversion: null, label: 'C', decimals: 1},
        temperature_difference: {conversion: null, label: 'C', decimals: 1},
        humidity_ratio: {conversion: null, label: 'kg/kg', decimals: 4},
        flow_rate: {conversion: null, label: 'm3/s', decimals: 3},
        specific_heat: {conversion: null, label: 'J/kg-K', decimals: 2},
        density: {conversion: null, label: 'kg/m3', decimals: 2},
        percent: {conversion: null, label: '%', decimals: 1},
        outdoor_air_percentage: {conversion: null, label: '%', decimals: 2},
        heat_transfer_rate_per_area: {conversion: null, label: 'W/m2', decimals: 2},
        area_per_heat_transfer_rate: {conversion: null, label: 'm2/W', decimals: 4},
        flow_rate_per_area: {conversion: null, label: 'm3/s-m2', decimals: 6},
        flow_rate_per_heat_transfer_rate: {conversion: null, label: 'm3/s-W', decimals: 6},
        people: {conversion: null, label: null, decimals: 1},
        area: {conversion: null, label: 'm2', decimals: 1}
    },
    ip: {
        heat_transfer_rate: {conversion: {multiply: 3.412141286}, label: 'Btu/hr', decimals: 0},
        temperature: {conversion: {multiply: 1.8, add: 32}, label: 'F', decimals: 1},
        temperature_difference: {conversion: {multiply: 1.8}, label: 'F', decimals: 1},
        humidity_ratio: {conversion: null, label: 'lb/lb', decimals: 4},
        flow_rate: {conversion: {multiply: 2118.881993}, label: 'ft3/min', decimals: 1},
        specific_heat: {conversion: {multiply: 0.000238846}, label: 'Btu/lb-F', decimals: 3},
        density: {conversion: {multiply: 0.062428}, label: 'lb/ft3', decimals: 3},
        percent: {conversion: null, label: '%', decimals: 1},
        outdoor_air_percentage: {conversion: null, label: '%', decimals: 2},
        heat_transfer_rate_per_area: {conversion: {multiply: 0.316998305}, label: 'Btu/hr-ft2', decimals: 2},
        area_per_heat_transfer_rate: {conversion: {multiply: 37855.092}, label: 'ft2/ton', decimals: 2},
        flow_rate_per_area: {conversion: {multiply: 196.8504938}, label: 'ft3/min-ft2', decimals: 2},
        flow_rate_per_heat_transfer_rate: {conversion: {multiply: 7451796.918}, label: 'ft3/min-ton', decimals: 2},
        people: {conversion: null, label: null, decimals: 1},
        area: {conversion: {multiply: 10.76391505}, label: 'ft2', decimals: 1}
    }
}