module SystemsAnalysisReport
  module Factories
    class SystemLoadSummaryFactory
      attr_reader :temperature_mapper, :airflow_mapper, :estimated_peak_load_component_table_mapper

      def initialize(temperature_mapper=Mappers::SystemTemperatureMapper, airflow_mapper=Mappers::SystemAirflowMapper,
                     estimated_peak_load_component_table_mapper=Mappers::SystemEstimatedPeakLoadComponentTableMapper)
        @temperature_mapper = temperature_mapper
        @airflow_mapper = airflow_mapper
        @estimated_peak_load_component_table_mapper = estimated_peak_load_component_table_mapper
      end

      def call(peak_condition, engineering_check, estimated_peak_load_component_table, coil)

        peak_condition = peak_condition
        engineering_check = engineering_check
        estimated_peak_load_component_table = @estimated_peak_load_component_table_mapper.(estimated_peak_load_component_table, coil)
        temperature = @temperature_mapper.(peak_condition, coil)
        airflow = @airflow_mapper.(peak_condition)

        Models::SystemLoadSummary.new(nil, peak_condition, engineering_check, estimated_peak_load_component_table,
                                      temperature, airflow)
      end
    end
  end
end