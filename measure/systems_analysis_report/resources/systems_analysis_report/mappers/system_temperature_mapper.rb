module SystemsAnalysisReport
  module Mappers
    class SystemTemperatureMapper
      def self.call(peak_condition, coil)
        outside_air = peak_condition.outside_dry_bulb_temperature
        return_air = coil.system_return_air_drybulb_at_ideal_loads_peak
        mixed_air = peak_condition.mixed_air_temperature
        supply_air = peak_condition.supply_air_temperature

        SystemsAnalysisReport::Models::SystemTemperature.new(outside_air, return_air, mixed_air, supply_air)
      end
    end
  end
end