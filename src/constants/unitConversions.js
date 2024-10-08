import config from '../store/config.json'

let conversions = {
    'unitless': {'convert':(value) => {return value}, label:""},
    'percent': {'convert':(value) => {return value}, label:"%"},
    'W': {'convert':(value) => {return value }, label:"W"},
    'kW': {'convert':(value) => {return value / 1000}, label: 'kW'},
    'btu/s': {'convert':(value) => {return value / 1055.055852}, label: 'Btu/s'},
    'btu/hr': {'convert':(value) => {return value * 3.412141286}, label: 'Btu/hr'},
    'C': {'convert':(value) => { return value }, label: 'C'},
    'F': {'convert':(value) => {return value * 1.8 + 32}, label: 'F'},
    'C_diff': {'convert':(value) => { return value }, label: '°C'},
    'F_diff': {'convert':(value) => {return value * 1.8}, label: '°F'},
    'K': {'convert':(value) => {return value + 273.15}, label: 'K'},
    'R': {'convert':(value) => {return value * 1.8 + 491.67}, label: 'R'},
    'K_diff': {'convert':(value) => {return value }, label: '°K'},
    'R_diff': {'convert':(value) => {return value * 1.8 }, label: '°R'},
    'kg': {'convert':(value) => {return value }, label: 'kg'},
    'ton': {'convert':(value) => {return value / 1000}, label: 'ton'},
    'us_ton': {'convert':(value) => {return value / 907.18474}, label: 'ton(us)'},
    'lb': {'convert':(value) => {return value * 2.2046226218488}, label: 'lb'},
    'ft3/hr': {'convert':(value) => {return value * 127132.79836558}, label: 'ft3/hr'},
    'ft3/min': {'convert':(value) => {return value * 2118.8799727597}, label: 'ft3/min'},
    'm3/hr': {'convert':(value) => {return value * 3600}, label: 'm3/hr'},
    'm3/s': {'convert':(value) => {return value }, label: 'm3/s'},
    'l/hr': {'convert':(value) => {return value * 3600000}, label: 'l/hr'},
    'l/min': {'convert':(value) => {return value * 60000}, label: 'l/min'},
    'l/s': {'convert':(value) => {return value * 1000}, label: 'l/s'},
    'us_gal/hr': {'convert':(value) => {return value * 951019.38849}, label: 'gal(us)/hr'},
    'us_gal/min': {'convert':(value) => {return value * 15850.32314}, label: 'gal(us)/min'},
    'J/g': {'convert':(value) => {return value / 1000}, label: 'J/g'},
    'btu/lb': {'convert':(value) => {return value / 2.3260}, label: 'Btu/lb'},
    'J/kg': {'convert':(value) => {return value / 1000 }, label: 'J/kg'},
    'kJ/kg': {'convert':(value) => {return value }, label: 'kJ/kg'},
    'J/g/C': {'convert':(value) => {return value / 1000}, label: 'J/g-C'},
    'btu/lb/F': {'convert':(value) => {return value / 4186.80}, label: 'Btu/lb-F'},
    'J/kg/C': {'convert':(value) => {return value }, label: 'J/kg-C'},
    'N/m2': {'convert':(value) => {return value }, label: 'Pa'},
    'lb/in2': {'convert':(value) => {return value / 6894.76 }, label: 'psi'},
    'm3/kg': {'convert':(value) => {return value }, label: 'm3/kg'},
    'ft3/lb': {'convert':(value) => {return value * 16.01846337396}, label: 'ft3/lb'},
    'kg/m3': {'convert':(value) => {return value }, label: 'kg/m3'},
    'lb/ft3': {'convert':(value) => {return value / 16.01846337396}, label: 'lb/ft3'},
    'lb/in3': {'convert':(value) => {return value / 27679.904710203}, label: 'lb/in3'},
    'W/ft2': {'convert':(value) => {return value / 10.76391041671}, label: 'W/ft2'},
    'W/m2': {'convert':(value) => {return value }, label: 'W/m2'},
    'btu/hr/ft2': {'convert':(value) => {return value * 3.4121416351331 / 10.76391041671}, label: 'Btu/hr-ft2'},
    'm2/W': {'convert':(value) => {return value }, label: 'm2/W'},
    'm2/kW': {'convert':(value) => {return value * 1000 }, label: 'm2/kW'},
    'ft2/ton_r': {'convert':(value) => {return value * 10.76391041671 * 3516.8528421}, label: 'ft2/ton'},
    'ft2/kbtu/hr': {'convert':(value) => {return value * 3154.59}, label: 'ft2/kBtu-hr'},
    'ft3/min/ft2': {'convert':(value) => {return value * 3.280839895013123 * 60}, label: 'ft3/min-ft2'},
    'm3/hr/m2': {'convert':(value) => {return value * 3600}, label: 'm3/hr-m2'},
    'l/s/m2': {'convert':(value) => {return value * 1000}, label: 'l/s-m2'},
    'm3/s/m2': {'convert':(value) => {return value }, label: 'm3/s-m2'},
    'ft3/min/ton_r': {'convert':(value) => {return value * 35.3147 * 60 / 3.41214 * 12000}, label: 'ft3/min-ton'},
    'l/s/kW': {'convert':(value) => {return value * 1000000}, label: 'l/s-kW'},
    'm3/s/W': {'convert':(value) => {return value }, label: 'm3/s-W'},
    'ft2': {'convert':(value) => {return value * 10.76391041671}, label: 'ft2'},
    'in2': {'convert':(value) => {return value * 1550.0031}, label: 'in2'},
    'm2': {'convert':(value) => {return value }, label: 'm2'},
    'cm2': {'convert':(value) => {return value * 10000}, label: 'cm2'},
    'mm2': {'convert':(value) => {return value * 1000000}, label: 'mm2'},
    'ac': {'convert':(value) => {return value / 4046.856}, label: 'ac'},
    'ha': {'convert':(value) => {return value / 10000}, label: 'ha'},
    'ton/ton': {'convert':(value) => {return value }, label: 'ton/ton'},
    'us_ton/us_ton': {'convert':(value) => {return value }, label: 'us_ton/us_ton'},
    'kg/kg': {'convert':(value) => {return value }, label: 'kg/kg'},
    'lb/lb': {'convert':(value) => {return value }, label: 'lb/lb'},
}

export var unitConversions = {
    si: {
        heat_transfer_rate: {conversion: conversions['W'], decimals: 0},
        temperature: {conversion:conversions['C'], decimals: 1},
        temperature_difference: {conversion:conversions['C_diff'], decimals: 1},
        humidity_ratio: {conversion:conversions['kg/kg'], decimals: 4},
        flow_rate: {conversion:conversions['m3/s'], decimals: 3},
        enthalpy: {conversion:conversions['kJ/kg'], decimals: 1},
        specific_heat: {conversion:conversions['J/kg/C'], decimals: 2},
        specific_volume: {conversion:conversions['m3/kg'], decimals: 3},
        density: {conversion:conversions['kg/m3'], decimals: 2},
        percent: {conversion:conversions['percent'], decimals: 1},
        outdoor_air_percentage: {conversion:conversions['percent'], decimals: 2},
        heat_transfer_rate_per_area: {conversion:conversions['W/m2'], decimals: 2},
        area_per_heat_transfer_rate: {conversion:conversions['m2/W'], decimals: 4},
        flow_rate_per_area: {conversion:conversions['m3/s/m2'], decimals: 6},
        flow_rate_per_heat_transfer_rate: {conversion:conversions['m3/s/W'], decimals: 6},
        people: {conversion:conversions['unitless'], decimals: 1},
        pressure: {conversion:conversions['N/m2'], decimals: 0},
        area: {conversion:conversions['m2'], decimals: 1}
    },
    ip: {
        heat_transfer_rate: {conversion:conversions['btu/hr'], decimals: 0},
        temperature: {conversion:conversions['F'], decimals: 1},
        temperature_difference: {conversion:conversions['F_diff'], decimals: 1},
        humidity_ratio: {conversion:conversions['lb/lb'], decimals: 4},
        flow_rate: {conversion:conversions['ft3/min'], decimals: 1},
        enthalpy: {conversion:conversions['btu/lb'], decimals: 1},
        specific_heat: {conversion:conversions['btu/lb/F'], decimals: 3},
        specific_volume: {conversion:conversions['ft3/lb'], decimals: 2},
        density: {conversion:conversions['lb/ft3'], decimals: 3},
        percent: {conversion:conversions['percent'], decimals: 1},
        outdoor_air_percentage: {conversion:conversions['percent'], decimals: 2},
        heat_transfer_rate_per_area: {conversion:conversions['btu/hr/ft2'], decimals: 2},
        area_per_heat_transfer_rate: {conversion:conversions['ft2/ton_r'], decimals: 2},
        flow_rate_per_area: {conversion:conversions['ft3/min/ft2'], decimals: 2},
        flow_rate_per_heat_transfer_rate: {conversion:conversions['ft3/min/ton_r'], decimals: 2},
        people: {conversion:conversions['unitless'], decimals: 1},
        pressure: {conversion:conversions['lb/in2'], decimals: 1},
        area: {conversion:conversions['ft2'], decimals: 1}
    },
    revit: {
        heat_transfer_rate: {conversion: conversions[config['units']['heat_transfer_rate']], decimals: 0},
        temperature: {conversion:conversions[config['units']['temperature']], decimals: 1},
        temperature_difference: {conversion:conversions[config['units']['temperature_difference']], decimals: 1},
        humidity_ratio: {conversion:conversions[config['units']['humidity_ratio']], decimals: 4},
        flow_rate: {conversion:conversions[config['units']['flow_rate']], decimals: 3},
        enthalpy: {conversion:conversions[config['units']['enthalpy']], decimals: 1},
        specific_heat: {conversion:conversions[config['units']['specific_heat']], decimals: 2},
        specific_volume: {conversion:conversions[config['units']['specific_volume']], decimals: 3},
        density: {conversion:conversions[config['units']['density']], decimals: 2},
        percent: {conversion:conversions[config['units']['percent']], decimals: 1},
        outdoor_air_percentage: {conversion:conversions[config['units']['outdoor_air_percentage']], decimals: 2},
        heat_transfer_rate_per_area: {conversion:conversions[config['units']['heat_transfer_rate_per_area']], decimals: 2},
        area_per_heat_transfer_rate: {conversion:conversions[config['units']['area_per_heat_transfer_rate']], decimals: 4},
        flow_rate_per_area: {conversion:conversions[config['units']['flow_rate_per_area']], decimals: 6},
        flow_rate_per_heat_transfer_rate: {conversion:conversions[config['units']['flow_rate_per_heat_transfer_rate']], decimals: 6},
        people: {conversion:conversions[config['units']['people']], decimals: 1},
        pressure: {conversion:conversions[config['units']['pressure']], decimals: 1},
        area: {conversion:conversions[config['units']['area']], decimals: 1}
    }
}

