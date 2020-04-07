require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe SystemAirflowMapper do
  describe "#call" do
    it "correctly creates a system temperature object when inputs aren't nil" do
      peak_condition = EPlusOut::Models::PeakCondition.new
      peak_condition.main_fan_air_flow = 1
      peak_condition.outside_air_flow = 0.5

      expected = SystemsAnalysisReport::Models::SystemAirflow.new(
          peak_condition.main_fan_air_flow, peak_condition.outside_air_flow
      )

      result = SystemAirflowMapper.call(peak_condition)

      result.must_equal expected
    end

    it "correctly creates a system temperature object when inputs are nil" do
      peak_condition = nil

      expected = SystemsAnalysisReport::Models::SystemAirflow.new

      result = SystemAirflowMapper.call(peak_condition)

      result.must_equal expected
    end
  end
end
