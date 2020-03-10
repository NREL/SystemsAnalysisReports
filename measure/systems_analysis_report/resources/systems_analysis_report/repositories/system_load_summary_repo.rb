module SystemsAnalysisReport
  module Repositories
    class SystemLoadSummaryRepo
      attr_reader :cooling_peak_conditions, :engineering_check_for_coolings, :engineering_check_for_heatings,
                  :estimated_cooling_peak_load_component_tables, :estimated_heating_peak_load_component_tables, :heating_peak_conditions

      def initialize(cooling_peak_conditions, engineering_check_for_coolings, engineering_check_for_heatings,
                     estimated_cooling_peak_load_component_tables, estimated_heating_peak_load_component_tables, heating_peak_conditions)
        @cooling_peak_conditions = cooling_peak_conditions
        @engineering_check_for_coolings = engineering_check_for_coolings
        @engineering_check_for_heatings = engineering_check_for_heatings
        @estimated_cooling_peak_load_component_tables = estimated_cooling_peak_load_component_tables
        @estimated_heating_peak_load_component_tables = estimated_heating_peak_load_component_tables
        @heating_peak_conditions = heating_peak_conditions

      end

      def find(name)
        result = SystemsAnalysisReport::Models::SystemLoadSummary.new
        result.name = name

        result.cooling_peak_condition = @cooling_peak_conditions.find_by_name(name)
        result.heating_peak_condition = @heating_peak_conditions.find_by_name(name)
        result.engineering_check_for_cooling = @engineering_check_for_coolings.find_by_name(name)
        result.engineering_check_for_heating = @engineering_check_for_heatings.find_by_name(name)
        result.estimated_cooling_peak_load_component_table = @estimated_cooling_peak_load_component_tables.find_by_name(name)
        result.estimated_heating_peak_load_component_table = @estimated_heating_peak_load_component_tables.find_by_name(name)

        result
      end
    end
  end
end