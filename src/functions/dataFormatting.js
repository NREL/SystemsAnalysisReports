import { isNumeric } from '../functions/numericFunctions';
import { unitConversions } from '../constants/unitConversions';
import locales from '../constants/locales';
var psychrolib = require('../lib/psychrolib.js');
psychrolib.SetUnitSystem(psychrolib.SI)

export const getObjectName = (objectList, id) => {
  // Get the string name of the object given an id
  if ( isNumeric(id) && objectList && objectList.length > 0 ) {
      for (var i = 0; i < objectList.length; i++) {
          if (
              Object.keys(objectList[i]).includes("id") && 
              objectList[i].id.toString() === id.toString()
              ) {
              return objectList[i].name
          }
      }
  } else return null
}

const generateStatePoints = (coil, pressure) => {
  let tDryBulb = coil['dry_bulb_temperature']
  let humidityRatio = coil['humidity_ratio']

  coil['relative_humidity'] = psychrolib.GetRelHumFromHumRatio(tDryBulb, humidityRatio, pressure) * 100
  coil['dewpoint_temperature'] = psychrolib.GetTDewPointFromHumRatio(tDryBulb, humidityRatio, pressure)
  coil['enthalpy'] = psychrolib.GetMoistAirEnthalpy(tDryBulb, humidityRatio) / 1000
  coil['wetbulb_temperature'] = psychrolib.GetTWetBulbFromHumRatio(tDryBulb, humidityRatio, pressure)
  coil['air_specific_volume'] = psychrolib.GetMoistAirVolume(tDryBulb, humidityRatio, pressure)
  coil['air_density'] = psychrolib.GetMoistAirDensity(tDryBulb, humidityRatio, pressure)
  coil['air_specific_heat'] = 1006 + 1860 * humidityRatio
  // Move specific heat to
  return coil
}

export const loadData = (data) => new Promise((resolve, reject) => {
  // function loads the data from JSON data file using Promise.
  
  setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 1);
  });

export function updateGrandTotalLoad(data) {
    // This function updates the grand total loads.

    // Initialize data objects
    data['grand_total'] = {
        "latent": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "total": 0.0,
        "percent_grand_total": 0.0
    };

    // Loop for row in data
    if (data) {
      Object.keys(data).map((rowName) => {
          if (data[rowName] && rowName !== 'grand_total') {
              Object.keys(data[rowName]).map((colName) => {
                  data['grand_total'][colName] += data[rowName][colName];

                  return data
              })
          }
          return data
      })
  }

    return data;
}

export function updatePercentTotalLoad(data) {
  // This function updates the percent grand total loads.
  const totalLoad = JSON.parse(JSON.stringify(data))['grand_total']['total'];

  // Loop for percent grand total
  if (data) {
    Object.keys(data).map((rowName) => {
        if (data[rowName] && rowName !== 'name') {
            data[rowName]["percent_grand_total"] = (data[rowName]["total"]/totalLoad)*100.0;
        }

        return data
    })
  }

  return data;
}

export const formatData = (data) => new Promise((resolve, reject) => {
  // This function formats the data that will be displayed in the table.
  var newData = data;

  // Adjust Zone Loads By Component
  Object.keys(newData['zone_load_summarys']).map((objKey) => {
    var loadObject = newData['zone_load_summarys'][objKey];

    //Update cooling load tables
    loadObject['cooling']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);
    loadObject['cooling']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);

    //Update heating load tables
    loadObject['heating']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);
    loadObject['heating']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);

    return loadObject;
  })

  // Adjust Systems Checksums
  Object.keys(newData['system_load_summarys']).map((objKey) => {
    var loadObject = newData['system_load_summarys'][objKey];
      
    // Update cooling load tables
    loadObject['cooling']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);
    loadObject['cooling']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);

    // Update heating load tables
    loadObject['heating']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);
    loadObject['heating']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);

    return loadObject;
  })

  Object.keys(newData['design_psychrometrics']).map((objKey) => {
    var loadObject = newData['design_psychrometrics'][objKey];
    var pressure = loadObject['summary']['atmospheric_pressure'];

    // Update cooling load tables
    loadObject['entering_coil'] = generateStatePoints(loadObject['entering_coil'], pressure);
    loadObject['leaving_coil'] = generateStatePoints(loadObject['leaving_coil'], pressure);
    loadObject['outdoor_air'] = generateStatePoints(loadObject['outdoor_air'], pressure);
    loadObject['zone'] = generateStatePoints(loadObject['zone'], pressure);
    loadObject['return_air'] = generateStatePoints(loadObject['return_air'], pressure);

    return loadObject;
  })

  resolve(newData);
})

export function convertDataUnit(unitSystem, type, value) {
  // Function to update a value to a new unit system.
  // Requires the unit system (i.e. "ip" or "si"), the type (e.g. "temperature")
  // and the numeric value (e.g. 4.12).  Returns the converted value.

  if (unitSystem && type && isNumeric(value)) {
    var newValue = value;
    const dataObject = unitConversions[unitSystem][type];

    if (dataObject["conversion"]) {
      var conversion = dataObject["conversion"]

      newValue = conversion['convert'](value)
    }

    if (Object.keys(dataObject).includes("decimals") && isNumeric(newValue)) {
      newValue = newValue.toFixed(dataObject["decimals"]);
    }

    return newValue
  } else {
    return value
  }
}

export function getUnitLabel(unitSystem, type, t) {
  // Function provides the data label in a specific unit system.
  // Requires the unit sytem (i.e. "ip" or "si"), the type (e.g. "temperature"). 
  // Returns the unit label (e.g. "C").

  if (unitSystem && type) {
      if(t) {
        return t("units:" + unitConversions[unitSystem][type]['conversion']["label"])
      } else {
        return unitConversions[unitSystem][type]['conversion']["label"]
      }
  } else {
    return null
  }
}

export function getLocaleLabel(locale, section, key) {
  // Function provides the label for a specific locale.
  // Requires the local (i.e. "en" or "de"), the label key (e.g. "zone_load_summary"). 
  // Returns the label (e.g. "Zone Load Summary").

  if (locale && section && key) {
      return locales[locale][section][key]
  } else {
    return null
  }
}

export const getHeatingAndCoolingPeakLoads = (unitSystem, objectName, data) => {
  // Assumes that Cooling Peak Condition Table - Sensible Peak Load is the appropriate total load value.
  // Investigate further whether this should be a calculated value from the subcomponents.
  
  if (data) {
      if (objectName) {
          const objectData = data[objectName]

          if (objectData) {
              // get load and convert unit system
              const peakCoolingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', objectData['cooling']['estimated_peak_load_component_table']['grand_total']['total']);
              const peakHeatingLoad = convertDataUnit(unitSystem, 'heat_transfer_rate', objectData['heating']['estimated_peak_load_component_table']['grand_total']['total']);

              const output = [ 
                  {'name': 'Cooling', 'value': parseInt(Math.abs(peakCoolingLoad))}, 
                  {'name': 'Heating', 'value': parseInt(Math.abs(peakHeatingLoad))}
              ]

              return output
          } else {
              return null
          }
      } else { 
          return null 
      }
  } else {
      return null
  }
}

export const formatLoadComponentChartData = (unitSystem, dataMapping, data) => {

  if (data) {
  // This function formats the data that will be displayed in a chart.
  var newData = [];

  // Loop for loadGroups and sum all of the totals
  Object.keys(dataMapping).map((group) => {
      var total = 0;
      // Loop again to total the loads for each load group
      dataMapping[group].map((loadComponent) => ( Object.keys(data).includes(loadComponent) ? total += Math.abs(data[loadComponent]['total']) : null ))

      // Convert unit system and add value to array
      newData.push({'name': group, 'value': parseInt(convertDataUnit(unitSystem, 'heat_transfer_rate', total))})
      return newData
  })

  return newData

  } else {
      return null
  }
}