export const designPsychrometricsMapping = {
    "componentTable":{
        "columns": [
            {"displayName": "Dry Bulb Temperature", "jsonKey": "dry_bulb_temperature", "type": "temperature"},
            {"displayName": "Humidity Ratio", "jsonKey": "humidity_ratio", "type": "humidity_ratio"},
            {"displayName": "Temperature Difference", "jsonKey": "temperature_difference", "type": "temperature_difference"},
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
                {"displayName": "System Name", "jsonKey": "name", "type": null},
                {"displayName": "Time of Peak", "jsonKey": "time_of_peak", "type": null},
                {"displayName": "Coil Air Flow Rate", "jsonKey": "coil_air_flow_rate", "type": "flow_rate"},
                {"displayName": "Zone Space Sensible Load", "jsonKey": "zone_sensible_load", "type": "heat_transfer_rate"},
                {"displayName": "Outdoor Air Flow Rate", "jsonKey": "outdoor_air_flow_rate", "type": "flow_rate"},
                {"displayName": "Percent Outdoor Air", "jsonKey": "percent_outdoor_air", "type": "percent"},
                {"displayName": "Air Specific Heat", "jsonKey": "air_specific_heat", "type": "specific_heat"},
                {"displayName": "Air Density", "jsonKey": "air_density", "type": "density"},           
            ]
        }
    ]
};

export const zoneLoadSummaryMapping = {
    "headerTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"}
         ],
        "rows": []
    },
    "envelopeLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
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
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
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
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
        ],
        "rows": [
            {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
            {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
            {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
            {"displayName": "Return Air - Other", "jsonKey": "return_air_other"},
            {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
            {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
            {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
            {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "totalLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
        ],
        "rows": [
            {"displayName": "Sizing Factor Adjustment", "jsonKey": "sizing_factor_correction"},
            {"displayName": "Time Delay Correction", "jsonKey": "time_delay_correction"},
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
                {"displayName": "DB", "jsonKey": "outside_dry_bulb_temperature", "type": "temperature"},
                {"displayName": "HR", "jsonKey": "outside_humidity_ratio_at_peak", "type": "humidity_ratio"},
                {"displayName": "WB", "jsonKey": "outside_wet_bulb_temperature", "type": "temperature"}
            ]
        },
        {
            "label": "Zone",
            "items": [
                {"displayName": "DB", "jsonKey": "zone_dry_bulb_temperature", "type": "temperature"},
                {"displayName": "HR", "jsonKey": "zone_humidity_ratio_at_peak", "type": "humidity_ratio"},
                {"displayName": "RH", "jsonKey": "zone_relative_humidity", "type": "percent"}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_capacity_per_floor_area", "type": "heat_transfer_rate_per_area"},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_capacity", "type": "area_per_heat_transfer_rate"},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "outside_air_percent", "type": "outdoor_air_percentage"},
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "type": "flow_rate_per_area"},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_capacity", "type": "flow_rate_per_heat_transfer_rate"},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "type": "people"},
            ]
        }
    ],
    "componentPieChart": {
        "Conduction": [
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
            "interzone_ceiling",
            "interzone_floor",
            "interzone_mixing",
            "interzone_wall",
        ],
        "Solar": [
            "fenestration_solar",
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
        "Outdoor Air": [
            "zone_ventilation",
            "doas_direct_to_zone",
        ],
        "Other": [
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "hvac_equipment_loss",
            "return_air_other",
            "transfer_air",
            "time_delay_correction",
            "difference_between_peak_and_estimated_sensible_load"
        ]
    }
};

export const systemLoadSummaryMapping = {
    "headerTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
        ],
        "rows": []
    },
    "envelopeLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
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
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
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
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
        ],
        "rows": [
            {"displayName": "Zone Ventilation", "jsonKey": "zone_ventilation"},
            {"displayName": "Transfer Air", "jsonKey": "interzone_mixing"},
            {"displayName": "DOAS Direct to Zone", "jsonKey": "doas_direct_to_zone"},
            {"displayName": "Return Air - Other", "jsonKey": "return_air_other"},
            {"displayName": "Supply Fan Heat", "jsonKey": "supply_fan_heat"},
            {"displayName": "Power Generation Equipment", "jsonKey": "power_generation_equipment"},
            {"displayName": "Refrigeration", "jsonKey": "refrigeration"},
            {"displayName": "Water Use Equipment", "jsonKey": "water_use_equipment"},
            {"displayName": "HVAC Equipment Loss", "jsonKey": "hvac_equipment_loss"},
            {"displayName": "Subtotal", "jsonKey": "subtotal"},
        ]
    },
    "totalLoadsTable":{
        "columns": [
            {"displayName": "Instant Sensible", "jsonKey": "sensible_instant", "type": "heat_transfer_rate"},
            {"displayName": "Delayed Sensible", "jsonKey": "sensible_delayed", "type": "heat_transfer_rate"},
            {"displayName": "Latent", "jsonKey": "latent", "type": "heat_transfer_rate"},
            {"displayName": "Total", "jsonKey": "total", "type": "heat_transfer_rate"},
            {"displayName": "Percent of Total", "jsonKey": "percent_grand_total", "type": "percent"},
        ],
        "rows": [
            {"displayName": "Sizing Factor Adjustment", "jsonKey": "sizing_factor_correction"},
            {"displayName": "Time Delay Correction", "jsonKey": "time_delay_correction"},
            {"displayName": "Grand Total", "jsonKey": "grand_total"},
        ]
    },
    "peakConditions": [
        {
            "Label": null,
            "items": [
                {"displayName": "Time at Peak", "jsonKey": "time_of_peak_load", "type": null}
            ]
        },
        {
            "label": "Outside",
            "items": [
                {"displayName": "DB", "jsonKey": "outside_dry_bulb_temperature", "type": "temperature"},
                {"displayName": "HR", "jsonKey": "outside_humidity_ratio_at_peak", "type": "humidity_ratio"},
                {"displayName": "WB", "jsonKey": "outside_wet_bulb_temperature", "type": "temperature"}
            ]
        }
    ],
    "temperatures": [
        {
            "label": null,
            "items": [
                {"displayName": "Return", "jsonKey": "return", "type": "temperature"},
                {"displayName": "Mixed Air", "jsonKey": "mixed_air", "type": "temperature"},
                {"displayName": "Supply", "jsonKey": "supply","type": "temperature"},
                {"displayName": "Fan Heat TD", "jsonKey": "fan_heat_temperature_difference", "type": "temperature"},
            ]
        }
    ],
    "airflows": [
        {
            "label": null,
            "items": [
                {"displayName": "Main Fan", "jsonKey": "main_fan", "type": "flow_rate"},
                {"displayName": "Ventilation", "jsonKey": "ventilation", "type": "flow_rate"}
            ]
        }
    ],
    "engineeringCheck": [
        {
            "label": null,
            "items": [
                {"displayName": "Capacity per Floor Area", "jsonKey": "total_capacity_per_floor_area", "type": "heat_transfer_rate_per_area"},
                {"displayName": "Floor Area per Capacity", "jsonKey": "floor_area_per_total_capacity", "type": "area_per_heat_transfer_rate"},
                {"displayName": "Outdoor Air Percentage", "jsonKey": "outside_air_percent", "type": "outdoor_air_percentage"},
                {"displayName": "Airflow per Floor Area", "jsonKey": "airflow_per_floor_area", "type": "flow_rate_per_area"},
                {"displayName": "Airflow per Capacity", "jsonKey": "airflow_per_total_capacity", "type": "flow_rate_per_heat_transfer_rate"},
                {"displayName": "Number of People", "jsonKey": "number_of_people", "type": "people"},
            ]
        }
    ],
    "componentPieChart": {
        "Conduction": [
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
            "interzone_ceiling",
            "interzone_floor",
            "interzone_mixing",
            "interzone_wall",
        ],
        "Solar": [
            "fenestration_solar",
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
        "Outdoor Air": [
            "zone_ventilation",
            "doas_direct_to_zone",
        ],
        "Other": [
            "power_generation_equipment",
            "refrigeration",
            "water_use_equipment",
            "hvac_equipment_loss",
            "return_air_other",
            "transfer_air",
            "time_delay_correction",
            "difference_between_peak_and_estimated_sensible_load"
        ]
    }
};