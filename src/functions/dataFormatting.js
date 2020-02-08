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

        return data
    })

    return data
}

export function addSizingFactorAdjustment(sizing_factor_diff, data) {
    // Initialize data objects
    data['sizing_factor_diff'] = {
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
    data['peak_estimate_diff'] = {
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
        data[rowName]["percent_grand_total"] = (data[rowName]["total"]/totalLoad)*100.0;
        return data
    })

    return data;
}

export const formatData = (data) => new Promise((resolve, reject) => {
    // This function formats the data that will be displayed in the table.
    var newData = data;
    var peak_estimate_diff = 0;
    var sizing_factor_diff = 0;

    // Adjust Zone Loads By Component
    newData['zone_loads_by_components'].map((loadObject) => {
        // Get cooling values
        peak_estimate_diff = loadObject['cooling_peak_condition_table']['peak_estimate_diff'];
        sizing_factor_diff = loadObject['cooling_peak_condition_table']['sf_diff'];

        //Update cooling load tables
        loadObject['cooling_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = addEstimatedDifference(peak_estimate_diff, loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling_peak_load_component_table']);

        //Update engineering checks
        loadObject['cooling_engineering_check_table']['peak_total_load'] = loadObject['cooling_peak_load_component_table']['grand_total']['total'];
        loadObject['cooling_engineering_check_table']['fan_flow'] = loadObject['cooling_peak_condition_table']['fan_flow'];


        // Get heating values
        peak_estimate_diff = loadObject['heating_peak_condition_table']['peak_estimate_diff'];
        sizing_factor_diff = loadObject['heating_peak_condition_table']['sf_diff'];

        //Update heating load tables
        loadObject['heating_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = addEstimatedDifference(peak_estimate_diff, loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating_peak_load_component_table']);

        //Update engineering checks
        loadObject['heating_peak_load_component_table']['peak_total_load'] = loadObject['heating_peak_load_component_table']['grand_total']['total'];
        loadObject['heating_peak_load_component_table']['fan_flow'] = loadObject['heating_peak_condition_table']['fan_flow'];


        return loadObject;
    })

    // Adjust Systems Checksums
    newData['system_checksums'].map((loadObject) => {
        // Get cooling values
        peak_estimate_diff = loadObject['cooling_peak_condition_table']['peak_estimate_diff'];
        sizing_factor_diff = loadObject['cooling_peak_condition_table']['sf_diff'];

        //Update cooling load tables
        loadObject['cooling_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = addEstimatedDifference(peak_estimate_diff, loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = updateGrandTotalLoad(loadObject['cooling_peak_load_component_table']);
        loadObject['cooling_peak_load_component_table'] = updatePercentTotalLoad(loadObject['cooling_peak_load_component_table']);

        //Update engineering checks
        loadObject['cooling_engineering_check_table']['peak_total_load'] = loadObject['cooling_peak_load_component_table']['grand_total']['total'];
        loadObject['cooling_engineering_check_table']['fan_flow'] = loadObject['cooling_peak_condition_table']['fan_flow'];


        // Get heating values
        peak_estimate_diff = loadObject['heating_peak_condition_table']['peak_estimate_diff'];
        sizing_factor_diff = loadObject['heating_peak_condition_table']['sf_diff'];

        //Update heating load tables
        loadObject['heating_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = addEstimatedDifference(peak_estimate_diff, loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = addSizingFactorAdjustment(sizing_factor_diff, loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = updateGrandTotalLoad(loadObject['heating_peak_load_component_table']);
        loadObject['heating_peak_load_component_table'] = updatePercentTotalLoad(loadObject['heating_peak_load_component_table']);

        //Update engineering checks
        loadObject['heating_peak_load_component_table']['peak_total_load'] = loadObject['heating_peak_load_component_table']['grand_total']['total'];
        loadObject['heating_peak_load_component_table']['fan_flow'] = loadObject['heating_peak_condition_table']['fan_flow'];
        
        return loadObject;
    })

    resolve(newData);
});