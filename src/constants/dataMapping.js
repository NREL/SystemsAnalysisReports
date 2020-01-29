
export const envelopeLoadsTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
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
};

export const internalGainTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
    ],
    "rows": [
        {"displayName": "People", "jsonKey": "people"},
        {"displayName": "Lights", "jsonKey": "lights"},
        {"displayName": "Return Air - Lights", "jsonKey": "return_air_lights"},
        {"displayName": "Equipment", "jsonKey": "equipment"},
        {"displayName": "Total", "jsonKey": "total"},
    ]
};

export const systemsLoadsTableMapping = {
    "columns": [
        {"displayName": "Return Air (W)", "jsonKey": "sensible_return_air"},
        {"displayName": "Instant Sensible (W)", "jsonKey": "sensible_instant"},
        {"displayName": "Delayed Sensible (W)", "jsonKey": "sensible_delayed"},
        {"displayName": "Latent (W)", "jsonKey": "latent"},
        {"displayName": "Total (W)", "jsonKey": "total"},
        {"displayName": "Percent of Total (%)", "jsonKey": "percent_grand_total"},
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
};

export const peakConditionTableMapping = [
    {
        "label": "Outside",
        "items": [
            {"displayName": "DB", "jsonKey": "oa_drybulb", "unitLabel": "C"},
            {"displayName": "HR", "jsonKey": "oa_hr", "unitLabel": "kg/kg"},
            {"displayName": "WB", "jsonKey": "oa_wetbulb", "unitLabel": "C"}
        ]
    },
    {
        "label": "Zone",
        "items": [
            {"displayName": "DB", "jsonKey": "zone_drybulb", "unitLabel": "C"},
            {"displayName": "HR", "jsonKey": "zone_hr", "unitLabel": "kg/kg"},
            {"displayName": "WB", "jsonKey": "zone_rh", "unitLabel": "C"}
        ]
    }
];

export const componentPieChartMapping = {
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

export const engineeringCheckTableMapping = [
    {
        "label": null,
        "items": [
            {"displayName": "m3/s-m2", "jsonKey": "airflow_per_floor_area", "unitLabel": null},
        ]
    },
    {
        "label": null,
        "items": [
            {"displayName": "people", "jsonKey": "number_of_people", "unitLabel": null},
        ]
    }
];
