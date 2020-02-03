// This script will generate a generic data.json file for testing.
// Script can be run using node.js with command "node generateJSON.js"

const fs = require('fs');

const numCoils = 5;
const numSystems = 10;
const numZones = 1000;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArbitrary(min, max) {
  return Number((Math.random() * (max - min) + min).toPrecision(5));
}

function getDesignPsychrometricObject() {
  return {
    "cad_object_id": i,
    "name": "Coil " + i.toString(),
    "air_density": getRandomArbitrary(0.8, 1.2),
    "air_specific_heat": getRandomArbitrary(0.9, 1.1),
    "coil_air_flow": getRandomArbitrary(0.5, 1.5),
    "entering_coil_drybulb": getRandomArbitrary(10, 25),
    "entering_coil_hr": getRandomArbitrary(0.001, 0.010),
    "leaving_coil_drybulb": getRandomArbitrary(10, 25),
    "leaving_coil_hr": getRandomArbitrary(0.001, 0.010),
    "oa_drybulb": getRandomArbitrary(0, 40),
    "oa_flow_rate": getRandomArbitrary(0.5, 1.0),
    "oa_hr": getRandomArbitrary(0.001, 0.010),
    "percent_oa": getRandomArbitrary(0.0, 1.0),
    "return_air_drybulb": getRandomArbitrary(10, 25),
    "return_air_hr": getRandomArbitrary(0.001, 0.010),
    "supply_fan_temp_diff": getRandomArbitrary(0.5, 2.0),
    "time_of_peak": "8/21 12:00:00",
    "zone_drybulb": getRandomArbitrary(10, 25),
    "zone_hr": getRandomArbitrary(0.001, 0.010),
    "zone_rh": getRandomArbitrary(10.0, 60.0),
    "zone_sensible_load": getRandomArbitrary(1000.0, 5000.0),
  }
}

function getCoolingPeakConditionObject() {
  return {
    "estimate_instant_delayed_sensible": getRandomArbitrary(1000.0, 5000.0),
    "fan_flow": getRandomArbitrary(0.5, 1.0),
    "mat": getRandomArbitrary(10, 25),
    "oa_drybulb": getRandomArbitrary(10, 25),
    "oa_flow": getRandomArbitrary(0.5, 1.0),
    "oa_hr": getRandomArbitrary(0.001, 0.010),
    "oa_wetbulb": getRandomArbitrary(10, 25),
    "peak_estimate_diff": getRandomArbitrary(0.5, 2.0),
    "sat": getRandomArbitrary(10, 25),
    "sensible_peak": getRandomArbitrary(1000.0, 5000.0),
    "sensible_peak_sf": getRandomArbitrary(1000.0, 5000.0),
    "sf_diff": getRandomArbitrary(0.5, 2.0),
    "time_of_peak_load": "7/21 16:45:00",
    "zone_drybulb": getRandomArbitrary(10, 25),
    "zone_hr": getRandomArbitrary(0.001, 0.010),
    "zone_rh": getRandomArbitrary(10.0, 60.0),
  }
}

function getHeatingPeakConditionObject() {
  return {
    "estimate_instant_delayed_sensible": -getRandomArbitrary(1000.0, 5000.0),
    "fan_flow": getRandomArbitrary(0.5, 1.0),
    "mat": getRandomArbitrary(10, 25),
    "oa_drybulb": getRandomArbitrary(10, 25),
    "oa_flow": getRandomArbitrary(0.5, 1.0),
    "oa_hr": getRandomArbitrary(0.001, 0.010),
    "oa_wetbulb": getRandomArbitrary(10, 25),
    "peak_estimate_diff": getRandomArbitrary(0.5, 2.0),
    "sat": getRandomArbitrary(10, 25),
    "sensible_peak": -getRandomArbitrary(1000.0, 5000.0),
    "sensible_peak_sf": -getRandomArbitrary(1000.0, 5000.0),
    "sf_diff": getRandomArbitrary(0.5, 2.0),
    "time_of_peak_load": "1/21 2:15:00",
    "zone_drybulb": getRandomArbitrary(10, 25),
    "zone_hr": getRandomArbitrary(0.001, 0.010),
    "zone_rh": getRandomArbitrary(10.0, 60.0),
  }
}


function getSystemEngineeringChecksumsObject() {
  return {
    "airflow_per_floor_area": getRandomArbitrary(0.01, 0.05),
    "airflow_per_total_cap": getRandomArbitrary(0.1, 0.9),
    "floor_area_per_total_cap": getRandomArbitrary(0.1, 0.9),
    "number_of_people": getRandomArbitrary(0, 20),
    "oa_percent": getRandomArbitrary(0, 1.0),
    "total_cap_per_floor_area": getRandomArbitrary(10.0, 100.0),
  }
}

function getZoneEngineeringChecksumsObject() {
  return {
    "airflow_per_floor_area": getRandomArbitrary(0.01, 0.05),
    "airflow_per_total_cap": getRandomArbitrary(0.1, 0.9),
    "floor_area_per_total_cap": getRandomArbitrary(0.1, 0.9),
    "number_of_people": getRandomArbitrary(0, 20),
    "oa_percent": getRandomArbitrary(0, 1.0),
    "total_cap_per_floor_area": getRandomArbitrary(10.0, 100.0),
  }
}

function getLoadComponentObject() {
  return {
    "latent": getRandomArbitrary(0.0, 10000.0),
    "percent_grand_total": getRandomArbitrary(0.0, 10000.0),
    "related_area": getRandomArbitrary(0.0, 10000.0),
    "sensible_delayed": getRandomArbitrary(0.0, 10000.0),
    "sensible_instant": getRandomArbitrary(0.0, 10000.0),
    "sensible_return_air": getRandomArbitrary(0.0, 10000.0),
  }
}

function getSystemLoadComponents() {
  return {
    "doas_direct_to_zone": getLoadComponentObject(),
    "equipment": getLoadComponentObject(),
    "exterior_floor": getLoadComponentObject(),
    "exterior_wall": getLoadComponentObject(),
    "fenestration_conduction": getLoadComponentObject(),
    "fenestration_solar": getLoadComponentObject(),
    "grand_total": getLoadComponentObject(),
    "ground_contact_floor": getLoadComponentObject(),
    "ground_contact_wall": getLoadComponentObject(),
    "hvac_equipment_loss": getLoadComponentObject(),
    "infiltration": getLoadComponentObject(),
    "interzone_ceiling": getLoadComponentObject(),
    "interzone_floor": getLoadComponentObject(),
    "interzone_mixing": getLoadComponentObject(),
    "interzone_wall": getLoadComponentObject(),
    "lights": getLoadComponentObject(),
    "opaque_door": getLoadComponentObject(),
    "other_floor": getLoadComponentObject(),
    "other_roof": getLoadComponentObject(),
    "other_wall": getLoadComponentObject(),
    "people": getLoadComponentObject(),
    "power_generation_equipment": getLoadComponentObject(),
    "refrigeration": getLoadComponentObject(),
    "roof": getLoadComponentObject(),
    "water_use_equipment": getLoadComponentObject(),
    "zone_ventilation": getLoadComponentObject()
  }
}

function getZoneLoadComponents() {
  return {
    "doas_direct_to_zone": getLoadComponentObject(),
    "equipment": getLoadComponentObject(),
    "exterior_floor": getLoadComponentObject(),
    "exterior_wall": getLoadComponentObject(),
    "fenestration_conduction": getLoadComponentObject(),
    "fenestration_solar": getLoadComponentObject(),
    "grand_total": getLoadComponentObject(),
    "ground_contact_floor": getLoadComponentObject(),
    "ground_contact_wall": getLoadComponentObject(),
    "hvac_equipment_loss": getLoadComponentObject(),
    "infiltration": getLoadComponentObject(),
    "interzone_ceiling": getLoadComponentObject(),
    "interzone_floor": getLoadComponentObject(),
    "interzone_mixing": getLoadComponentObject(),
    "interzone_wall": getLoadComponentObject(),
    "lights": getLoadComponentObject(),
    "opaque_door": getLoadComponentObject(),
    "other_floor": getLoadComponentObject(),
    "other_roof": getLoadComponentObject(),
    "other_wall": getLoadComponentObject(),
    "people": getLoadComponentObject(),
    "power_generation_equipment": getLoadComponentObject(),
    "refrigeration": getLoadComponentObject(),
    "roof": getLoadComponentObject(),
    "water_use_equipment": getLoadComponentObject(),
    "zone_ventilation": getLoadComponentObject()
  }
}

// Initialize JSON Object
jsonData = {};

// Design Psychrometrics
jsonData['design_psychrometrics'] = [];
for (var i=1; i<=numCoils; i++) {
  jsonData['design_psychrometrics'].push(getDesignPsychrometricObject());
}

// System Checksums
jsonData['system_checksums'] = [];
for (var i=1; i<=numSystems; i++) {
  var systemChecksums = {
    "cad_object_id": i.toString(),
    "name": "System " + i.toString(),
    "cooling_engineering_check_table":{},
    "cooling_peak_condition_table":{},
    "cooling_peak_load_component_table":{},
    "heating_engineering_check_table":{},
    "heating_peak_condition_table":{},
    "heating_peak_load_component_table":{}
  }

  systemChecksums["cooling_engineering_check_table"] = getSystemEngineeringChecksumsObject()
  systemChecksums["cooling_peak_condition_table"] = getCoolingPeakConditionObject()
  systemChecksums["cooling_peak_load_component_table"] = getSystemLoadComponents()
  systemChecksums["heating_engineering_check_table"] = getSystemEngineeringChecksumsObject()
  systemChecksums["heating_peak_condition_table"] = getHeatingPeakConditionObject()
  systemChecksums["heating_peak_load_component_table"] = getSystemLoadComponents()

  jsonData['system_checksums'].push(systemChecksums);
}

// zone_loads_by_components
jsonData['zone_loads_by_components'] = [];
for (var i=1; i<=numZones; i++) {
  var zoneChecksums = {
    "cad_object_id": i.toString(),
    "name": "Zone " + i.toString(),
    "cooling_engineering_check_table":{},
    "cooling_peak_condition_table":{},
    "cooling_peak_load_component_table":{},
    "heating_engineering_check_table":{},
    "heating_peak_condition_table":{},
    "heating_peak_load_component_table":{}
  }

  zoneChecksums["cooling_engineering_check_table"] = getZoneEngineeringChecksumsObject()
  zoneChecksums["cooling_peak_condition_table"] = getCoolingPeakConditionObject()
  zoneChecksums["cooling_peak_load_component_table"] = getZoneLoadComponents()
  zoneChecksums["heating_engineering_check_table"] = getZoneEngineeringChecksumsObject()
  zoneChecksums["heating_peak_condition_table"] = getHeatingPeakConditionObject()
  zoneChecksums["heating_peak_load_component_table"] = getZoneLoadComponents()

  jsonData['zone_loads_by_components'].push(zoneChecksums);
}

//console.log(JSON.stringify(jsonData));

//Get the file contents
var txtFile = "./data.json";
var str = JSON.stringify(jsonData);
console.log("data created...");

console.log("writing file...");
fs.writeFile(txtFile, str, (err) => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log("complete...");
});