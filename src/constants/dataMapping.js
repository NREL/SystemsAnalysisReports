export const designPsychrometricsMapping = {
    "componentTable":{
        "columns": [
            {"displayName": "Dry Bulb Temperature [C]", "jsonKey": "dry_bulb_temperature", "decimals": 1},
            {"displayName": "Humidity Ratio [kg/kg]", "jsonKey": "humidity_ratio", "decimals": 4},
            {"displayName": "Temperature Difference [C]", "jsonKey": "temperature_difference", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Zone", "jsonKey": "zone"},
            {"displayName": "Return Air", "jsonKey": "return_air"},
            {"displayName": "Outdoor Air", "jsonKey": "outdoor_air"},
            {"displayName": "Entering Coil", "jsonKey": "entering_coil"},
            {"displayName": "Leaving Coil", "jsonKey": "leaving_coil"},
            {"displayName": "Supply Fan", "jsonKey": "supply_fan"},
        ]
    },
    "componentChecks": [
        {
            "label": null,
            "items": [
                {"displayName": "System Name", "jsonKey": "name", "unitLabel": null},
                {"displayName": "Time of Peak", "jsonKey": "time_of_peak", "unitLabel": null},
                {"displayName": "Coil Air Flow Rate", "jsonKey": "coil_air_flow_rate", "unitLabel": "m3/s", "decimals": 3},
                {"displayName": "Zone Space Sensible Load", "jsonKey": "zone_sensible_load", "unitLabel": "W", "decimals": 0},
                {"displayName": "Outdoor Air Flow Rate", "jsonKey": "outdoor_air_flow_rate", "unitLabel": "m3/s", "decimals": 3},
                {"displayName": "Percent Outdoor Air", "jsonKey": "percent_outdoor_air", "unitLabel": "%", "decimals": 1},
                {"displayName": "Air Specific Heat", "jsonKey": "air_specific_heat", "unitLabel": "J-kg/K", "decimals": 2},
                {"displayName": "Air Density", "jsonKey": "air_density", "unitLabel": "kg/m3", "decimals": 2},           
            ]
        }
    ]
};

export const zoneLoadSummaryMapping = {
    "headerTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": []
    },
    "envelopeLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Roof", "jsonKey": "roof"},
            {"displayName": "Other - Roof", "jsonKey": "other_roof"},
            {"displayName": "Ceiling", "jsonKey": "interzone_ceiling"},
            {"displayName": "Glass - Conduction", "jsonKey": "fenestration_conduction"},
            {"displayName": "Glass - Solar", "jsonKey": "fenestration_solar"},
            {"displayName": "Door", "jsonKey": "opaque_door"},
            {"displayName": "Wall", "jsonKey": "exterior_wall"},
            {"displayName": "Below-grade Wall", "jsonKey": "ground_contact_wall"},
            {"displayName": "Partition", "jsonKey": "interzone_wall"},
            {"displayName": "Other - Wall", "jsonKey": "other_wall"},
            {"displayName": "Exterior Floor", "jsonKey": "exterior_floor"},
            {"displayName": "Interior Floor", "jsonKey": "interzone_floor"},
            {"displayName": "Slab", "jsonKey": "ground_contact_floor"},
            {"displayName": "Other - Floor", "jsonKey": "other_floor"},
            {"displayName": "Infiltration", "jsonKey": "infiltration"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "internalGainsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "People", "jsonKey": "people"},
            {"displayName": "Lights", "jsonKey": "lights"},
            {"displayName": "Return Air - Lights", "jsonKey": "return_air_lights"},
            {"displayName": "Equipment", "jsonKey": "equipment"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "systemLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Return Air - Other", "jsonKey": "return_air_other"},
            {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
            {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
            {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
            {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
            {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
            {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
            {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "totalLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Sizing Factor Adjustment (W)", "jsonKey": "difference_due_to_sizing_factor"},
            {"displayName": "Time Delay Correction (W)", "jsonKey": "difference_between_peak_and_estimated_sensible_load"},
            {"displayName": "Grand Total", "jsonKey": "grand_total"},
        ]
    },
    "peakConditions": [
        {
            "Label": null,
            "items": [
                {"displayName": "Time at Peak", "jsonKey": "time_of_peak_load", "unitLabel": null}
            ]
        },
        {
            "label": "Outside",
            "items": [
                {"displayName": "DB", "jsonKey": "outside_dry_bulb_temperature", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "outside_humidity_ratio_at_peak", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "outside_wet_bulb_temperature", "unitLabel": "C", "decimals": 1}
            ]
        },
        {
            "label": "Zone",
            "items": [
                {"displayName": "DB", "jsonKey": "zone_dry_bulb_temperature", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "zone_humidity_ratio_at_peak", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "RH", "jsonKey": "zone_relative_humidity", "unitLabel": "%", "decimals": 1}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_capacity_per_floor_area", "unitLabel": "W/m2", "decimals": 1},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_capacity", "unitLabel": "m2/W", "decimals": 2},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "outside_air_percent", "unitLabel": "%", "decimals": 1},
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "unitLabel": "m3/s-m2", "decimals": 4},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_capacity", "unitLabel": "m3/s-W", "decimals": 4},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "unitLabel": null, "decimals": 0},
            ]
        }
    ],
    "componentPieChart": {
        "Envelope": [
            "infiltration",
            "ground_contact_floor",
            "ground_contact_wall",
            "fenestration_conduction",
            "opaque_door",
            "other_floor",
            "other_roof",
            "other_wall",
            "roof",
            "exterior_floor",
            "exterior_wall",
        ],
        "Solar": [
            "fenestration_solar",
        ],
        "Interzone": [
            "interzone_ceiling",
            "interzone_floor",
            "interzone_mixing",
            "interzone_wall",
        ],
        "Equipment": [
            "equipment",
        ],
        "Lights": [
            "lights",
            "return_air_lights",
        ],
        "People": [
            "people",
        ],
        "HVAC": [
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "hvac_equipment_loss",
            "return_air_other",
            "transfer_air",
            "doas_direct_to_zone",
        ]
    }
};

export const systemLoadSummaryMapping = {
    "headerTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": []
    },
    "envelopeLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Roof", "jsonKey": "roof"},
            {"displayName": "Other - Roof", "jsonKey": "other_roof"},
            {"displayName": "Ceiling", "jsonKey": "interzone_ceiling"},
            {"displayName": "Glass - Conduction", "jsonKey": "fenestration_conduction"},
            {"displayName": "Glass - Solar", "jsonKey": "fenestration_solar"},
            {"displayName": "Door", "jsonKey": "opaque_door"},
            {"displayName": "Wall", "jsonKey": "exterior_wall"},
            {"displayName": "Below-grade Wall", "jsonKey": "ground_contact_wall"},
            {"displayName": "Partition", "jsonKey": "interzone_wall"},
            {"displayName": "Other - Wall", "jsonKey": "other_wall"},
            {"displayName": "Exterior Floor", "jsonKey": "exterior_floor"},
            {"displayName": "Interior Floor", "jsonKey": "interzone_floor"},
            {"displayName": "Slab", "jsonKey": "ground_contact_floor"},
            {"displayName": "Other - Floor", "jsonKey": "other_floor"},
            {"displayName": "Infiltration", "jsonKey": "infiltration"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "internalGainsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "People", "jsonKey": "people"},
            {"displayName": "Lights", "jsonKey": "lights"},
            {"displayName": "Return Air - Lights", "jsonKey": "return_air_lights"},
            {"displayName": "Equipment", "jsonKey": "equipment"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "systemLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
            {"displayName": "Return Air - Other", "jsonKey": "return_air_other"},
            {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
            {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
            {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
            {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
            {"displayName": "Fan Heat", "jsonKey": "supply_fan_heat"},
            {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
            {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
            {"displayName": "Time Delay Correction", "jsonKey": "time_delay_correction"},
            {"displayName": "Sizing Factor Correction", "jsonKey": "sizing_factor_correction"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "totalLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant", "decimals": 0},
            {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed", "decimals": 0},
            {"displayName": "Latent (W)", "jsonKey": "latent", "decimals": 0},
            {"displayName": "Total (W)", "jsonKey": "total", "decimals": 0},
            {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Sizing Factor Adjustment (W)", "jsonKey": "difference_due_to_sizing_factor"},
            {"displayName": "Time Delay Correction (W)", "jsonKey": "difference_between_peak_and_estimated_sensible_load"},
            {"displayName": "Grand Total", "jsonKey": "grand_total"},
        ]
    },
    "peakConditions": [
        {
            "Label": null,
            "items": [
                {"displayName": "Time at Peak", "jsonKey": "time_of_peak_load", "unitLabel": null}
            ]
        },
        {
            "label": "Outside",
            "items": [
                {"displayName": "DB", "jsonKey": "outside_dry_bulb_temperature", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "outside_humidity_ratio_at_peak", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "outside_wet_bulb_temperature", "unitLabel": "C", "decimals": 1}
            ]
        }
    ],
    "temperatures": [
        {
            "label": null,
            "items": [
                {"displayName": "Return", "jsonKey": "return", "unitLabel": "C", "decimals": 1},
                {"displayName": "Mixed Air", "jsonKey": "mixed_air", "unitLabel": "C", "decimals": 1},
                {"displayName": "Supply", "jsonKey": "supply", "unitLabel": "C", "decimals": 1},
                {"displayName": "Fan Heat TD", "jsonKey": "fan_heat_temperature_difference", "unitLabel": "C", "decimals": 1},
            ]
        }
    ],
    "airflows": [
        {
            "label": null,
            "items": [
                {"displayName": "Main Fan", "jsonKey": "main_fan", "unitLabel": "m3/s", "decimals": 1},
                {"displayName": "Ventilation", "jsonKey": "ventilation", "unitLabel": "m3/s", "decimals": 1}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_capacity_per_floor_area", "unitLabel": "W/m2", "decimals": 1},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_capacity", "unitLabel": "m2/W", "decimals": 2},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "outside_air_percent", "unitLabel": "%", "decimals": 1},
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "unitLabel": "m3/s-m2", "decimals": 4},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_capacity", "unitLabel": "m3/s-W", "decimals": 4},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "unitLabel": null, "decimals": 0},
            ]
        }
    ],
    "componentPieChart": {
        "Envelope": [
            "infiltration",
            "ground_contact_floor",
            "ground_contact_wall",
            "fenestration_conduction",
            "opaque_door",
            "other_floor",
            "other_roof",
            "other_wall",
            "roof",
            "exterior_floor",
            "exterior_wall",
        ],
        "Solar": [
            "fenestration_solar",
        ],
        "Interzone": [
            "interzone_ceiling",
            "interzone_floor",
            "interzone_mixing",
            "interzone_wall",
        ],
        "Equipment": [
            "equipment",
        ],
        "Lights": [
            "lights",
            "return_air_lights"
        ],
        "People": [
            "people",
        ],
        "HVAC": [
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "hvac_equipment_loss",
            "zone_ventilation",
            "return_air_other",
            "transfer_air",
            "doas_direct_to_zone",
        ]
    }
};