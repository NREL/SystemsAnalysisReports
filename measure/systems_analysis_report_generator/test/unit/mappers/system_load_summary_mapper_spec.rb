require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe SystemLoadSummaryMapper do
  describe "#call" do
    it "correctly creates a system load summary object" do
      temperature_mapper = Mock.new
      airflow_mapper = Mock.new
      estimated_peak_load_component_table_mapper = Mock.new
      peak_condition = Object.new
      engineering_check = Object.new
      estimated_peak_load_component_table = Object.new
      coil_sizing_detail = Object.new
      temperature = Object.new
      airflow = Object.new
      peak_load_component_table = Object.new

      mapper = SystemLoadSummaryMapper.new(temperature_mapper, airflow_mapper, estimated_peak_load_component_table_mapper)

      temperature_mapper.expect :call, temperature, [peak_condition, coil_sizing_detail]
      airflow_mapper.expect :call, airflow, [peak_condition]
      estimated_peak_load_component_table_mapper.expect :call, peak_load_component_table, [estimated_peak_load_component_table, coil_sizing_detail]
      expected = SystemsAnalysisReport::Models::SystemLoadSummary.new(nil, peak_condition, engineering_check, peak_load_component_table, temperature, airflow)

      result = mapper.(peak_condition, engineering_check, estimated_peak_load_component_table, coil_sizing_detail)

      result.must_equal expected
    end
  end
end