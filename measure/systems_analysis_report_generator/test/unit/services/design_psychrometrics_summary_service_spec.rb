require_relative '../../test_helper'

include SystemsAnalysisReport::Services

describe DesignPsychrometricService do
  describe "#call" do
    it "returns an array of found SystemLoadSummaries" do
      repo = Mock.new
      name_strategy = Mock.new
      names = ["Cooling Coil 1"], ["Cooling Coil 2"]
      model, psychrometric_1, psychrometric_2 = Object.new, Object.new, Object.new

      service = DesignPsychrometricService.new(repo, name_strategy)

      name_strategy.expect :call, names, [model]
      repo.expect :find, psychrometric_1, ["Cooling Coil 1"]
      repo.expect :find, psychrometric_2, ["Cooling Coil 2"]

      expected = [psychrometric_1, psychrometric_2]

      result = service.(model)

      result.must_equal expected
    end

    it "doesn't return nil values from the repository" do
      repo = Mock.new
      name_strategy = Mock.new
      names = ["Cooling Coil 1"], ["Cooling Coil 2"]
      model, psychrometric_1, psychrometric_2 = Object.new, nil, Object.new

      service = DesignPsychrometricService.new(repo, name_strategy)

      name_strategy.expect :call, names, [model]
      repo.expect :find, psychrometric_1, ["Cooling Coil 1"]
      repo.expect :find, psychrometric_2, ["Cooling Coil 2"]

      expected = [psychrometric_2]

      result = service.(model)

      result.must_equal expected
    end
  end
end