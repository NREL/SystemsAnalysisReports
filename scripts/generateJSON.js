// This script will generate a generic data.json file for testing.
// Script can be run using node.js with command "node generateJSON.js"

const fs = require('fs');

const numCoils = 10;
const numSystems = 100;
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
    "coil_air_flow_rate": getRandomArbitrary(0.5, 1.5),
    "entering_coil_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "entering_coil_humidity_ratio": getRandomArbitrary(0.001, 0.010),
    "leaving_coil_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "leaving_coil_humidity_ratio": getRandomArbitrary(0.001, 0.010),
    "outdoor_air_dry_bulb_temperature": getRandomArbitrary(0, 40),
    "outdoor_air_flow_rate": getRandomArbitrary(0.5, 1.0),
    "outdoor_air_humidity_ratio": getRandomArbitrary(0.001, 0.010),
    "percent_outdoor_air": getRandomArbitrary(0.0, 1.0),
    "return_air_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "return_air_humidity_ratio": getRandomArbitrary(0.001, 0.010),
    "supply_fan_temperature_difference": getRandomArbitrary(0.5, 2.0),
    "time_of_peak": "8/21 12:00:00",
    "zone_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "zone_humidity_ratio": getRandomArbitrary(0.001, 0.010),
    "zone_relative_humidity": getRandomArbitrary(10.0, 60.0),
    "zone_sensible_load": getRandomArbitrary(1000.0, 5000.0),
  }
}

function getCoolingPeakConditionObject() {
  return {
    "difference_between_peak_and_estimated_sensible_load": getRandomArbitrary(1000.0, 5000.0),
    "difference_due_to_sizing_factor": 0.0,
    "estimate_instant_delayed_sensible_load": getRandomArbitrary(1000.0, 5000.0),
    "main_fan_air_flow": getRandomArbitrary(0.5, 1.0),
    "mixed_air_temperature": getRandomArbitrary(10, 25),
    "outside_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "outside_wet_bulb_temperature": getRandomArbitrary(10, 25),
    "outside_air_flow": getRandomArbitrary(0.5, 1.0),
    "outside_humidity_ratio_at_peak": getRandomArbitrary(0.001, 0.010),
    "peak_sensible_load": getRandomArbitrary(1000.0, 5000.0),
    "peak_sensible_load_with_sizing_factor": getRandomArbitrary(1000.0, 5000.0),
    "supply_air_temperature": getRandomArbitrary(10, 25),
    "time_of_peak_load": "6/21 14:00:00",
    "zone_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "zone_humidity_ratio_at_peak": getRandomArbitrary(0.001, 0.010),
    "zone_relative_humidity": getRandomArbitrary(10, 50),
  }
}

function getHeatingPeakConditionObject() {
  return {
    "difference_between_peak_and_estimated_sensible_load": -getRandomArbitrary(1000.0, 5000.0),
    "difference_due_to_sizing_factor": 0.0,
    "estimate_instant_delayed_sensible_load": -getRandomArbitrary(1000.0, 5000.0),
    "main_fan_air_flow": getRandomArbitrary(0.5, 1.0),
    "mixed_air_temperature": getRandomArbitrary(10, 25),
    "outside_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "outside_wet_bulb_temperature": getRandomArbitrary(10, 25),
    "outside_air_flow": getRandomArbitrary(0.5, 1.0),
    "outside_humidity_ratio_at_peak": getRandomArbitrary(0.001, 0.010),
    "peak_sensible_load": -getRandomArbitrary(1000.0, 5000.0),
    "peak_sensible_load_with_sizing_factor": -getRandomArbitrary(1000.0, 5000.0),
    "supply_air_temperature": getRandomArbitrary(10, 25),
    "time_of_peak_load": "6/21 14:00:00",
    "zone_dry_bulb_temperature": getRandomArbitrary(10, 25),
    "zone_humidity_ratio_at_peak": getRandomArbitrary(0.001, 0.010),
    "zone_relative_humidity": getRandomArbitrary(10, 50),
  }
}

function getSystemEngineeringChecksumsObject() {
  return {
    "airflow_per_floor_area": getRandomArbitrary(0.01, 0.05),
    "airflow_per_total_capacity": getRandomArbitrary(0.1, 0.9),
    "floor_area_per_total_capacity": getRandomArbitrary(0.1, 0.9),
    "number_of_people": getRandomArbitrary(0, 20),
    "outside_air_percent": getRandomArbitrary(0, 100.0),
    "total_capacity_per_floor_area": getRandomArbitrary(10.0, 100.0),
  }
}

function getZoneEngineeringChecksumsObject() {
  return {
    "airflow_per_floor_area": getRandomArbitrary(0.01, 0.05),
    "airflow_per_total_capacity": getRandomArbitrary(0.1, 0.9),
    "floor_area_per_total_capacity": getRandomArbitrary(0.1, 0.9),
    "number_of_people": getRandomArbitrary(0, 20),
    "outside_air_percent": getRandomArbitrary(0, 100.0),
    "total_capacity_per_floor_area": getRandomArbitrary(10.0, 100.0),
  }
}

function getLoadComponentObject() {
  return {
    "latent": getRandomArbitrary(0.0, 10000.0),
    "percent_grand_total": getRandomArbitrary(0.0, 100.0),
    "related_area": getRandomArbitrary(0.0, 10000.0),
    "sensible_delayed": getRandomArbitrary(0.0, 10000.0),
    "sensible_instant": getRandomArbitrary(0.0, 10000.0),
    "sensible_return_air": getRandomArbitrary(0.0, 10000.0),
    "total": getRandomArbitrary(0.0, 10000.0),
  }
}

function getTemperatureObject() {
  return {
    "supply": getRandomArbitrary(10, 25),
    "return": getRandomArbitrary(10, 25),
    "mixed_air": getRandomArbitrary(10, 25),
    "fan_heat_temperature_difference": getRandomArbitrary(10, 25),
  }
}


function getAirflowObject() {
  return {
    "main_fan": getRandomArbitrary(0.1, 0.9),
    "ventilation": getRandomArbitrary(0.1, 0.9),
  }
}

function getSystemLoadComponents() {
  return {
    "doas_direct_to_zone": getLoadComponentObject(),
    "equipment": getLoadComponentObject(),
    "exterior_floor": getLoadComponentObject(),
    "exterior_wall": getLoadComponentObject(),
    //"fan_heat": getLoadComponentObject(),
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
    "zone_ventilation": getLoadComponentObject(),
    "return_air_lights": getLoadComponentObject(),
    "return_air_other": getLoadComponentObject(),
    "difference_due_to_sizing_factor": getLoadComponentObject(),
    "difference_between_peak_and_estimated_sensible_load": getLoadComponentObject()
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
    "return_air_lights": getLoadComponentObject(),
    "return_air_other": getLoadComponentObject(),
    "difference_due_to_sizing_factor": getLoadComponentObject(),
    "difference_between_peak_and_estimated_sensible_load": getLoadComponentObject()
  }
}

// Initialize JSON Object
var jsonData = {};

// Design Psychrometrics
jsonData['design_psychrometrics'] = {};
for (var i=1; i<=numCoils; i++) {

  var coilName = "Coil " + i.toString();
  var designPsychrometrics = {};
  designPsychrometrics = getDesignPsychrometricObject();
  jsonData['design_psychrometrics'][coilName] = designPsychrometrics;
}

// System Checksums
jsonData['system_load_summarys'] = {};
for (var i=1; i<=numSystems; i++) {
  var sysName = "System " + i.toString();
  var systemLoadSummary = {
    "cad_object_id": i.toString(),
    "name": sysName,
    "cooling": {
        "engineering_check":{},
        "peak_condition":{},
        "estimated_peak_load_component_table":{},
        "temperature": {},
        "airflow": {}
    },
    "heating": {
      "engineering_check":{},
      "peak_condition":{},
      "estimated_peak_load_component_table":{},
      "temperature": {},
      "airflow": {}
    }
  }

  systemLoadSummary["cooling"]["engineering_check"] = getSystemEngineeringChecksumsObject()
  systemLoadSummary["cooling"]["peak_condition"] = getCoolingPeakConditionObject()
  systemLoadSummary["cooling"]["estimated_peak_load_component_table"] = getSystemLoadComponents()
  systemLoadSummary["cooling"]["temperature"] = getTemperatureObject()
  systemLoadSummary["cooling"]["airflow"] = getAirflowObject()
  systemLoadSummary["heating"]["engineering_check"] = getSystemEngineeringChecksumsObject()
  systemLoadSummary["heating"]["peak_condition"] = getHeatingPeakConditionObject()
  systemLoadSummary["heating"]["estimated_peak_load_component_table"] = getSystemLoadComponents()
  systemLoadSummary["heating"]["temperature"] = getTemperatureObject()
  systemLoadSummary["heating"]["airflow"] = getAirflowObject()

  jsonData['system_load_summarys'][sysName] = systemLoadSummary;
}

// Zone Load Summary
jsonData['zone_load_summarys'] = {};
for (var i=1; i<=numZones; i++) {
  var zoneName = "Zone " + i.toString();
  var zoneLoadSummary = {
    "cad_object_id": i.toString(),
    "name": zoneName,
    "cooling": {
        "engineering_check":{},
        "peak_condition":{},
        "estimated_peak_load_component_table":{}
    },
    "heating": {
      "engineering_check":{},
      "peak_condition":{},
      "estimated_peak_load_component_table":{}
    }
  }

  zoneLoadSummary["cooling"]["engineering_check"] = getZoneEngineeringChecksumsObject()
  zoneLoadSummary["cooling"]["peak_condition"] = getCoolingPeakConditionObject()
  zoneLoadSummary["cooling"]["estimated_peak_load_component_table"] = getZoneLoadComponents()
  zoneLoadSummary["heating"]["engineering_check"] = getZoneEngineeringChecksumsObject()
  zoneLoadSummary["heating"]["peak_condition"] = getHeatingPeakConditionObject()
  zoneLoadSummary["heating"]["estimated_peak_load_component_table"] = getZoneLoadComponents()

  jsonData['zone_load_summarys'][zoneName] = zoneLoadSummary;
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