export const loadData = (data) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 1);
  });

  export function updateGrandTotalLoad(data) {
    // This function updates the grand total loads.

    // Initialize data objects
    data['grand_total'] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
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

    console.log(loadObject);

    return loadObject;
  })

  resolve(newData);
})