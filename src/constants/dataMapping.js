export const designPsychrometricsMapping = {
    "componentTable":{
        "columns": [
            {"displayName": "Dry Bulb Temperature [C]", "jsonKey": "drybulb", "decimals": 1},
            {"displayName": "Humidity Ratio [kg/kg]", "jsonKey": "hr", "decimals": 4},
            {"displayName": "Temperature Difference [C]", "jsonKey": "temp_diff", "decimals": 1},
        ],
        "rows": [
            {"displayName": "Zone", "jsonKey": "zone"},
            {"displayName": "Return Air", "jsonKey": "return_air"},
            {"displayName": "Outdoor Air", "jsonKey": "oa"},
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
                {"displayName": "Coil Air Flow Rate", "jsonKey": "coil_air_flow", "unitLabel": "m3/s", "decimals": 3},
                {"displayName": "Zone Space Sensible Load", "jsonKey": "zone_sensible_load", "unitLabel": "W", "decimals": 0},
                {"displayName": "Outdoor Air Flow Rate", "jsonKey": "oa_flow_rate", "unitLabel": "m3/s", "decimals": 3},
                {"displayName": "Percent Outdoor Air", "jsonKey": "percent_oa", "unitLabel": "%", "decimals": 1},
                {"displayName": "Air Specific Heat", "jsonKey": "air_specific_heat", "unitLabel": "J-kg/K", "decimals": 2}, 
                {"displayName": "Air Density", "jsonKey": "air_density", "unitLabel": "kg/m3", "decimals": 2},           
            ]
        }
    ]
};

export const zoneLoadSummaryMapping = {
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
            {"displayName": "Total", "jsonKey": "total"},
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
            {"displayName": "Total", "jsonKey": "total"},
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
            {"displayName": "Total", "jsonKey": "total"},
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
                {"displayName": "DB", "jsonKey": "oa_drybulb", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "oa_hr", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "oa_wetbulb", "unitLabel": "C", "decimals": 1}
            ]
        },
        {
            "label": "Zone",
            "items": [
                {"displayName": "DB", "jsonKey": "zone_drybulb", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "zone_hr", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "zone_rh", "unitLabel": "C", "decimals": 1}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "unitLabel": "m3/s-m2", "decimals": 4},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_cap", "unitLabel": "m3/s-W", "decimals": 4},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_cap", "unitLabel": "m2/W", "decimals": 2},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "unitLabel": null, "decimals": 0},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "oa_percent", "unitLabel": "%", "decimals": 1},
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_cap_per_floor_area", "unitLabel": "W/m2", "decimals": 1},
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
        ],
        "People": [
            "people",
        ],
        "HVAC": [
            "doas_direct_to_zone",
            "hvac_equipment_loss",
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "zone_ventilation",
        ]
    }
};

export const systemLoadSummaryMapping = {
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
            {"displayName": "Total", "jsonKey": "total"},
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
            {"displayName": "Total", "jsonKey": "total"},
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
            {"displayName": "Fan Heat", "jsonKey": "fan_heat"},
            {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
            {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
            {"displayName": "Total", "jsonKey": "total"},
        ]
    },
    "peakConditions": [
        {
            "label": "Outside",
            "items": [
                {"displayName": "DB", "jsonKey": "oa_drybulb", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "oa_hr", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "oa_wetbulb", "unitLabel": "C", "decimals": 1}
            ]
        },
        {
            "label": "Zone",
            "items": [
                {"displayName": "DB", "jsonKey": "zone_drybulb", "unitLabel": "C", "decimals": 1},
                {"displayName": "HR", "jsonKey": "zone_hr", "unitLabel": "kg/kg", "decimals": 4},
                {"displayName": "WB", "jsonKey": "zone_rh", "unitLabel": "C", "decimals": 1}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "unitLabel": "m3/s-m2", "decimals": 4},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_cap", "unitLabel": "m3/s-W", "decimals": 4},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_cap", "unitLabel": "m2/W", "decimals": 2},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "unitLabel": null, "decimals": 0},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "oa_percent", "unitLabel": "%", "decimals": 1},
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_cap_per_floor_area", "unitLabel": "W/m2", "decimals": 1},
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
        ],
        "People": [
            "people",
        ],
        "HVAC": [
            "doas_direct_to_zone",
            "hvac_equipment_loss",
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "zone_ventilation",
        ]
    }
};