require_relative '../../test_helper'

include SystemsAnalysisReport::Strategies

describe ZoneNameGetter do
  describe ".call" do
    it "return a list of names from an OpenStudio Model" do
      model = OpenStudio::Model::Model.new
      OpenStudio::Model::ThermalZone.new(model).setName("Zone 1")
      OpenStudio::Model::ThermalZone.new(model).setName("Zone 2")

      expected = ["Zone 1", "Zone 2"]

      result = ZoneNameGetter.(model)

      result.sort.must_equal expected.sort
    end
  end
end
