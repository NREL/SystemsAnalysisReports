module SystemsAnalysisReport
  module Repositories
    class SystemLoadSummaryRepo
      attr_reader :cooling_peak_conditions, :engineering_check_for_coolings, :engineering_check_for_heatings,
                  :estimated_cooling_peak_load_component_tables, :estimated_heating_peak_load_component_tables,
                  :heating_peak_conditions, :coil_sizing_details, :factory

      def initialize(cooling_peak_conditions, engineering_check_for_coolings, engineering_check_for_heatings,
                     estimated_cooling_peak_load_component_tables, estimated_heating_peak_load_component_tables,
                     heating_peak_conditions, coil_sizing_details, factory=Factories::SystemLoadSummaryFactory.new)
        @cooling_peak_conditions = cooling_peak_conditions
        @engineering_check_for_coolings = engineering_check_for_coolings
        @engineering_check_for_heatings = engineering_check_for_heatings
        @estimated_cooling_peak_load_component_tables = estimated_cooling_peak_load_component_tables
        @estimated_heating_peak_load_component_tables = estimated_heating_peak_load_component_tables
        @heating_peak_conditions = heating_peak_conditions
        @coil_sizing_details = coil_sizing_details
        @factory = factory
      end

      def find(name, cooling_coil, heating_coil)
        cooling_peak_condition = @cooling_peak_conditions.find_by_name(name)
        engineering_check_for_cooling = @engineering_check_for_coolings.find_by_name(name)
        estimated_cooling_peak_load_component_table = @estimated_cooling_peak_load_component_tables.find_by_name(name)
        cooling_coil = @coil_sizing_details.find_by_name(cooling_coil)

        heating_peak_condition = @heating_peak_conditions.find_by_name(name)
        engineering_check_for_heating = @engineering_check_for_heatings.find_by_name(name)
        estimated_heating_peak_load_component_table = @estimated_heating_peak_load_component_tables.find_by_name(name)
        heating_coil = @coil_sizing_details.find_by_name(heating_coil)

        cooling = @factory.(cooling_peak_condition, engineering_check_for_cooling,
            estimated_cooling_peak_load_component_table, cooling_coil
        )

        heating = @factory.(heating_peak_condition, engineering_check_for_heating,
            estimated_heating_peak_load_component_table, heating_coil)

        Models::CoolingAndHeating.new(name, cooling, heating)
      end
    end
  end
end