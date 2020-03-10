require_relative '../../test_helper'

include SystemsAnalysisReport::Strategies

describe CoolingCoilNameGetter do
  describe ".call" do
    it "returns an array of cooling coils" do
      model = OpenStudio::Model::Model.new
      coil_1 = OpenStudio::Model::CoilCoolingDXSingleSpeed.new(model)
      coil_2 = OpenStudio::Model::CoilCoolingDXTwoSpeed.new(model)

      expected = [coil_1, coil_2]

      result = CoolingCoilNameGetter.(model)

      result.must_equal expected
    end
  end
end
