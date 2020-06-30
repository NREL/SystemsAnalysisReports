require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe SystemEstimatedPeakLoadComponentTableMapper do
  describe "#call" do
    it "should create a normalized Peak Load Component Table" do
      peak_load_component_table_mapper, ventilation_mapper, supply_fan_heat_mapper, time_delay_correction_mapper,
          sizing_factor_correction_mapper, peak_load_component_table = Mock.new, Mock.new, Mock.new, Mock.new, Mock.new,
          Mock.new

      estimated_peak_load_component_table, peak_condition, coil_sizing_detail = Object.new, Object.new, Object.new
      ventilation_load, supply_fan_heat_load, time_delay_correction_load, sizing_factor_load =
          Object.new, Object.new, Object.new, Object.new

      mapper = SystemEstimatedPeakLoadComponentTableMapper.new(peak_load_component_table_mapper, ventilation_mapper,
                                                               supply_fan_heat_mapper, time_delay_correction_mapper,
                                                               sizing_factor_correction_mapper)

      peak_load_component_table_mapper.expect :call, peak_load_component_table, [estimated_peak_load_component_table]
      ventilation_mapper.expect :call, ventilation_load, [coil_sizing_detail]
      supply_fan_heat_mapper.expect :call, supply_fan_heat_load, [coil_sizing_detail]
      time_delay_correction_mapper.expect :call, time_delay_correction_load, [peak_condition]
      sizing_factor_correction_mapper.expect :call, sizing_factor_load, [peak_condition]

      peak_load_component_table.expect :add_load, nil, [:zone_ventilation, ventilation_load]
      peak_load_component_table.expect :add_load, nil, [:supply_fan_heat, supply_fan_heat_load]
      peak_load_component_table.expect :add_load, nil, [:time_delay_correction, time_delay_correction_load]
      peak_load_component_table.expect :add_load, nil, [:sizing_factor_correction, sizing_factor_load]
      peak_load_component_table.expect :normalize, nil

      mapper.(estimated_peak_load_component_table, peak_condition, coil_sizing_detail)

      assert peak_load_component_table_mapper.verify
      assert ventilation_mapper.verify
      assert supply_fan_heat_mapper.verify
      assert time_delay_correction_mapper.verify
      assert sizing_factor_correction_mapper.verify
      assert peak_load_component_table.verify
    end

    it "shouldn't map the coil sizing detail if it is nil" do
      peak_load_component_table_mapper, ventilation_mapper, supply_fan_heat_mapper, time_delay_correction_mapper,
          sizing_factor_correction_mapper, peak_load_component_table = Mock.new, Object.new, Object.new, Mock.new, Mock.new,
          Mock.new

      estimated_peak_load_component_table, peak_condition, coil_sizing_detail = Object.new, Object.new, Object.new
       time_delay_correction_load, sizing_factor_load = Object.new, Object.new

      mapper = SystemEstimatedPeakLoadComponentTableMapper.new(peak_load_component_table_mapper, ventilation_mapper,
                                                               supply_fan_heat_mapper, time_delay_correction_mapper,
                                                               sizing_factor_correction_mapper)

      peak_load_component_table_mapper.expect :call, peak_load_component_table, [estimated_peak_load_component_table]
      time_delay_correction_mapper.expect :call, time_delay_correction_load, [peak_condition]
      sizing_factor_correction_mapper.expect :call, sizing_factor_load, [peak_condition]

      peak_load_component_table.expect :add_load, nil, [:time_delay_correction, time_delay_correction_load]
      peak_load_component_table.expect :add_load, nil, [:sizing_factor_correction, sizing_factor_load]
      peak_load_component_table.expect :normalize, nil

      mapper.(estimated_peak_load_component_table, peak_condition, nil)

      assert peak_load_component_table_mapper.verify
      assert time_delay_correction_mapper.verify
      assert sizing_factor_correction_mapper.verify
      assert peak_load_component_table.verify
    end
  end
end