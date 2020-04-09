require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe SystemTemperatureMapper do
  describe "#call" do
    it "correctly creates a system temperature object when inputs aren't nil" do
      peak_condition = EPlusOut::Models::PeakCondition.new
      peak_condition.outside_dry_bulb_temperature = 32
      peak_condition.mixed_air_temperature = 28
      peak_condition.supply_air_temperature = 13

      coil_sizing_detail = EPlusOut::Models::CoilSizingDetail.new
      coil_sizing_detail.system_return_air_drybulb_at_ideal_loads_peak = 23

      expected = SystemsAnalysisReport::Models::SystemTemperature.new(
          peak_condition.outside_dry_bulb_temperature, coil_sizing_detail.system_return_air_drybulb_at_ideal_loads_peak,
          peak_condition.mixed_air_temperature, peak_condition.supply_air_temperature
      )

      result = SystemTemperatureMapper.call(peak_condition, coil_sizing_detail)

      result.must_equal expected
    end

    it "correctly creates a system temperature object when inputs are nil" do
      peak_condition = nil
      coil_sizing_detail = nil

      expected = SystemsAnalysisReport::Models::SystemTemperature.new

      result = SystemTemperatureMapper.call(peak_condition, coil_sizing_detail)

      result.must_equal expected
    end
  end
end