require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe OtherReturnAirPeakLoadMapper do
  describe "#call" do
    it "correctly creates a system temperature object when inputs aren't nil" do
      lighting_load = EPlusOut::Models::EstimatedPeakLoadComponent.new
      lighting_load.sensible_return_air = 50

      equipment_load = EPlusOut::Models::EstimatedPeakLoadComponent.new
      equipment_load.sensible_return_air = 60

      load_table = EPlusOut::Models::EstimatedPeakLoadComponentTable.new
      load_table.lights = lighting_load
      load_table.equipment = equipment_load

      expected = SystemsAnalysisReport::Models::PeakLoadComponent.new
      expected.sensible_instant = 60

      result = OtherReturnAirPeakLoadMapper.new.call(load_table)

      result.must_equal expected
    end
  end
end