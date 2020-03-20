module SystemsAnalysisReport
  module Mappers
    class SystemEstimatedPeakLoadComponentTableMapper
      def self.call(estimated_peak_load_component_table, coil)
        values = [0, coil.latent_load, 0, 0, coil.sensible_load, 0, coil.total_load, 0]

        ventilation_peak_load = EPlusOut::Models::EstimatedPeakLoadComponent.new(*values)

        result = estimated_peak_load_component_table.dup
        result.zone_ventilation = ventilation_peak_load
        result
      end
    end
  end
end