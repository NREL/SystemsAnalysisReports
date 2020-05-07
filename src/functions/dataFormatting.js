import { isNumeric } from '../functions/numericFunctions';
import unitConversions from '../constants/unitConversions';

export const loadData = (data) => new Promise((resolve, reject) => {
  // function loads the data from JSON data file usign Promise.  
  
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

  resolve(newData);
})

export function convertDataUnit(unitSystem, type, value) {
  // Function to update a value to a new unit system.
  // Requires the unit sytem (i.e. "ip" or "si"), the type (e.g. "temperature")
  // and the numeric value (e.g. 4.12).  Returns the converted value.

  if (unitSystem && type && value) {
    var newValue = value;
    const dataObject = unitConversions[unitSystem][type];

    if (dataObject["conversion"]) {
      const conversion = dataObject["conversion"]

      if (Object.keys(conversion).includes("multiply")) {
        newValue = newValue * conversion["multiply"];
      }

      if (Object.keys(conversion).includes("add")) {
        newValue = newValue + conversion["add"];
      }
    }

    if (Object.keys(dataObject).includes("decimals") && isNumeric(newValue)) {
      newValue = newValue.toFixed(dataObject["decimals"]);
    }

    return newValue
  } else {
    return value
  }
}

export function getUnitLabel(unitSystem, type) {
  // Function provides the data label in a specific unit system.
  // Requires the unit sytem (i.e. "ip" or "si"), the type (e.g. "temperature"). 
  // Returns the unit label (e.g. "C").

  if (unitSystem && type) {
      return unitConversions[unitSystem][type]["label"]
  } else {
    return null
  }
}