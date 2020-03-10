require_relative '../../test_helper'

include SystemsAnalysisReport::Services

describe ZoneLoadSummaryService do
  describe "#call" do
    it "returns an array of found ZoneLoadSummaries" do
      repo = Mock.new
      name_strategy = Mock.new
      names = ["Zone 1", "Zone 2"]
      model, zone_1, zone_2 = Object.new, Object.new, Object.new

      service = ZoneLoadSummaryService.new(repo, name_strategy)

      name_strategy.expect :call, names, [model]
      repo.expect :find, zone_1, ["Zone 1"]
      repo.expect :find, zone_2, ["Zone 2"]

      expected = [zone_1, zone_2]

      result = service.(model)

      result.must_equal expected
    end
  end
end