require_relative '../../test_helper'

include SystemsAnalysisReport::Services

describe SystemLoadSummaryService do
  describe "#call" do
    it "returns an array of found SystemLoadSummaries" do
      repo = Mock.new
      name_strategy = Mock.new
      names = [["System 1", "Heating Coil 1", "Cooling Coil 1"], ["System 2","Heating Coil 2", "Cooling Coil 2"]]
      model, system_1, system_2 = Object.new, Object.new, Object.new

      service = SystemLoadSummaryService.new(repo, name_strategy)

      name_strategy.expect :call, names, [model]
      repo.expect :find, system_1, ["System 1", "Heating Coil 1", "Cooling Coil 1"]
      repo.expect :find, system_2, ["System 2", "Heating Coil 2", "Cooling Coil 2"]

      expected = [system_1, system_2]

      result = service.(model)

      result.must_equal expected
    end
  end
end
