module SystemsAnalysisReport
  module Mappers
    class DesignPsychrometricSummaryMapper < Mapper
      def klass
        Models::DesignPsychrometricSummary
      end

      def mapping
        [
            [:coil_air_volume_flow_rate_at_ideal_loads_peak, :coil_air_flow_rate],
            # [:coil_final_reference_air_volume_flow_rate, :coil_air_flow_rate],
            [:outdoor_air_volume_flow_rate_at_ideal_loads_peak, :outdoor_air_flow_rate],
            [:outdoor_air_flow_percentage_at_ideal_loads_peak, :percent_outdoor_air],
            [:date_time_at_sensible_ideal_loads_peak, :time_of_peak],
            [:coil_sensible_capacity_at_ideal_loads_peak, :zone_sensible_load],
        ]
      end

      def call(coil_sizing_detail, location)
        result = super(coil_sizing_detail)

        fan_temp_diff = 0.0

        if coil_sizing_detail.supply_fan_maximum_air_mass_flow_rate > 0 and coil_sizing_detail.moist_air_heat_capacity > 0
          fan_temp_diff = coil_sizing_detail.supply_fan_air_heat_gain_at_ideal_loads_peak / (coil_sizing_detail.supply_fan_maximum_air_mass_flow_rate *
            coil_sizing_detail.moist_air_heat_capacity)
        end

        result.supply_fan_temperature_difference = fan_temp_diff

        result.atmospheric_pressure = location.standard_pressure_at_elevation

        # result.percent_outdoor_air = 100.0 * (result.outdoor_air_flow_rate / result.coil_air_flow_rate)
        if coil_sizing_detail.date_time_at_air_flow_ideal_loads_peak == 'unknown'
          result.time_of_peak = "7/21 12:00:00"
        end

        result
      end
    end
  end
end