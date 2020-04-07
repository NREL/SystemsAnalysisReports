module SystemsAnalysisReport
  module Mappers
    class EstimatedPeakLoadComponentTableToPeakLoadComponentTable
      attr_reader :peak_load_component_mapper

      def initialize(peak_load_component_mapper)
        @peak_load_component_mapper = peak_load_component_mapper
      end

      def call(estimated_peak_load_component_table)
        result = Models::PeakLoadComponentTable.new

        estimated_peak_load_component_table.each_pair { |key, value| result[key] = @peak_load_component_mapper.(value) if value }
        result
      end
    end
  end
end