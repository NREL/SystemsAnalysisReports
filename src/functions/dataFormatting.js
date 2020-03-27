export const loadData = (data) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 1);
  });

export function shiftReturnAirLoads(data) {
    // This function shifts the return air loads from lighting and equipment to new table rows "return_air_lighting" and "return_air_other"

    // Initialize new data objects
    data['return_air_lights'] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
        "total": 0.0,
        "percent_grand_total": 0.0
    };

    data["return_air_other"] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
        "total": 0.0,
        "percent_grand_total": 0.0
    };

    // Loop for row in data
    Object.keys(data).map((rowName) => {
        if (rowName !== 'name') {
            const returnAirLoad = JSON.parse(JSON.stringify(data))[rowName]['sensible_return_air'];

            // If loads exist
            if (returnAirLoad > 0) {
            // Determine type of load (lighting or other)
            if ( rowName === 'lights') {
                // Lighting loads
                data["return_air_lights"]["sensible_instant"] = returnAirLoad;     
            } else {
                // Increment all other loads
                data["return_air_other"]["sensible_instant"] += returnAirLoad;                   
            }

            // Remove sensible_return air load and reduce total load
            data[rowName]["sensible_return_air"] = 0; 
            }

            // Recalculate total
            data[rowName]["total"] = 0
            data[rowName]["total"] += data[rowName]["sensible_instant"]
            data[rowName]["total"] += data[rowName]["sensible_delayed"]
            data[rowName]["total"] += data[rowName]["latent"]
            data[rowName]["total"] += data[rowName]["sensible_return_air"]
        }

        return data
    })

    return data
}

export function addSizingFactorAdjustment(sizing_factor_diff, data) {
    // Initialize data objects
    data['difference_due_to_sizing_factor'] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": 0.0,
        "sensible_instant": sizing_factor_diff,
        "sensible_return_air": 0.0,
        "total": sizing_factor_diff,
        "percent_grand_total": 0.0
    };

    return data
}

export function addEstimatedDifference(peak_diff, data) {
    // Initialize data objects
    data['difference_between_peak_and_estimated_sensible_load'] = {
        "latent": 0.0,
        "related_area": 0.0,
        "sensible_delayed": peak_diff,
        "sensible_instant": 0.0,
        "sensible_return_air": 0.0,
        "total": peak_diff,
        "percent_grand_total": 0.0
    };

    return data
}

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
    Object.keys(data).map((rowName) => {
        if (rowName !== 'grand_total') {
            Object.keys(data[rowName]).map((colName) => {
                data['grand_total'][colName] += data[rowName][colName];

                return data
            })
        }
        return data
    })

    return data;
}

export function updatePercentTotalLoad(data) {
    // This function updates the percent grand total loads.
    const totalLoad = JSON.parse(JSON.stringify(data))['grand_total']['total'];

    // Loop for percent grand total
    Object.keys(data).map((rowName) => {
        if (rowName !== 'name') {
            data[rowName]["percent_grand_total"] = (data[rowName]["total"]/totalLoad)*100.0;
        }

        return data
    })

    return data;
}

export const formatData = (data) => new Promise((resolve, reject) => {
    // This function formats the data that will be displayed in the table.
    var newData = data;
    var difference_between_peak_and_estimated_sensible_load = 0;
    var sizing_factor_diff = 0;

    // Adjust Zone Loads By Component
    Object.keys(newData['zone_load_summarys']).map((objKey) => {
        var loadObject = newData['zone_load_summarys'][objKey];

        // Get cooling values
        difference_between_peak_and_estimated_sensible_load = loadObject['cooling']['peak_condition']['difference_between_peak_and_estimated_sensible_load'];
        sizing_factor_diff = loadObject['cooling']['peak_condition']['difference_due_to_sizing_factor'];

        //Update cooling load tables
        loadObject['cooling']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = addEstimatedDifference(difference_between_peak_and_estimated_sensible_load, loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);

        //Update engineering checks
        loadObject['cooling']['engineering_check']['peak_total_load'] = loadObject['cooling']['estimated_peak_load_component_table']['grand_total']['total'];
        loadObject['cooling']['engineering_check']['fan_flow'] = loadObject['cooling']['peak_condition']['fan_flow'];


        // Get heating values
        difference_between_peak_and_estimated_sensible_load = loadObject['heating']['peak_condition']['difference_between_peak_and_estimated_sensible_load'];
        sizing_factor_diff = loadObject['heating']['peak_condition']['difference_due_to_sizing_factor'];

        //Update heating load tables
        loadObject['heating']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = addEstimatedDifference(difference_between_peak_and_estimated_sensible_load, loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);

        //Update engineering checks
        loadObject['heating']['estimated_peak_load_component_table']['peak_total_load'] = loadObject['heating']['estimated_peak_load_component_table']['grand_total']['total'];
        loadObject['heating']['estimated_peak_load_component_table']['fan_flow'] = loadObject['heating']['peak_condition']['fan_flow'];


        return loadObject;
    })

    // Adjust Systems Checksums
    Object.keys(newData['system_load_summarys']).map((objKey) => {
        var loadObject = newData['system_load_summarys'][objKey];

        // Get cooling values
        difference_between_peak_and_estimated_sensible_load = loadObject['cooling']['peak_condition']['difference_between_peak_and_estimated_sensible_load'];
        sizing_factor_diff = loadObject['cooling']['peak_condition']['difference_due_to_sizing_factor'];

        //Update cooling load tables
        loadObject['cooling']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = addEstimatedDifference(difference_between_peak_and_estimated_sensible_load, loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);
        loadObject['cooling']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling']['estimated_peak_load_component_table']);

        //Update engineering checks
        loadObject['cooling']['engineering_check']['peak_total_load'] = loadObject['cooling']['estimated_peak_load_component_table']['grand_total']['total'];
        loadObject['cooling']['engineering_check']['fan_flow'] = loadObject['cooling']['peak_condition']['fan_flow'];


        // Get heating values
        difference_between_peak_and_estimated_sensible_load = loadObject['heating']['peak_condition']['difference_between_peak_and_estimated_sensible_load'];
        sizing_factor_diff = loadObject['heating']['peak_condition']['difference_due_to_sizing_factor'];

        //Update heating load tables
        loadObject['heating']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = addEstimatedDifference(difference_between_peak_and_estimated_sensible_load, loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);
        loadObject['heating']['estimated_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating']['estimated_peak_load_component_table']);

        //Update engineering checks
        loadObject['heating']['estimated_peak_load_component_table']['peak_total_load'] = loadObject['heating']['estimated_peak_load_component_table']['grand_total']['total'];
        loadObject['heating']['estimated_peak_load_component_table']['fan_flow'] = loadObject['heating']['peak_condition']['fan_flow'];
        
        return loadObject;
    })

    resolve(newData);
});