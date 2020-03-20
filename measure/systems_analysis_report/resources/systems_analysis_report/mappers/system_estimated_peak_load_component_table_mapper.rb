module SystemsAnalysisReport
  module Mappers
    class SystemEstimatedPeakLoadComponentTableMapper
      def self.call(estimated_peak_load_component_table, coil)
        ventilation_peak_load = EPlusOut::Models::EstimatedPeakLoadComponent.new()
        ventilation_peak_load.latent = coil.latent_load
        ventilation_peak_load.sensible_instant = coil.sensible_load
        ventilation_peak_load.total = coil.total_load

        result = estimated_peak_load_component_table.dup
        result.zone_ventilation = ventilation_peak_load
        result
      end
    end
  end
end