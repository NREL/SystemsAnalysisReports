module SystemsAnalysisReport
  module Mappers
    class EstimatedPeakLoadComponentTableToPeakLoadComponentTable
      def call(estimated_peak_load_component_table)
        result = Models::PeakLoadComponentTable.new

        estimated_peak_load_component_table.each_pair { |key, value| result[key] = value.dup if value }
        result
      end
    end
  end
end