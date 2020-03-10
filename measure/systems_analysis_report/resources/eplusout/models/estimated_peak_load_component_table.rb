module EPlusOut
  module Models
    EstimatedPeakLoadComponentTable = Struct.new(
        :name,
        :doas_direct_to_zone,
        :equipment,
        :exterior_floor,
        :exterior_wall,
        :fenestration_conduction,
        :fenestration_solar,
        :grand_total,
        :ground_contact_floor,
        :ground_contact_wall,
        :hvac_equipment_loss,
        :infiltration,
        :interzone_ceiling,
        :interzone_floor,
        :interzone_mixing,
        :interzone_wall,
        :lights,
        :opaque_door,
        :other_floor,
        :other_roof,
        :other_wall,
        :people,
        :power_generation_equipment,
        :refrigeration,
        :roof,
        :water_use_equipment,
        :zone_ventilation
    ) do
      include Models::Model
    end
  end
end