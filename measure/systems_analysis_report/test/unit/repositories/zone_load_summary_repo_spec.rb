require_relative '../../test_helper'

include SystemsAnalysisReport::Repositories

describe ZoneLoadSummaryRepo do
  describe "#find" do
    it "returns a constructed ZoneLoadSummary" do
      name = "zone 1"
      cooling_peak_conditions = Mock.new
      heating_peak_conditions = Mock.new
      engineering_check_for_coolings = Mock.new
      engineering_check_for_heatings = Mock.new
      estimated_cooling_peak_load_component_tables = Mock.new
      estimated_heating_peak_load_component_tables = Mock.new

      zone_load_summarys_repo = SystemsAnalysisReport::Repositories::ZoneLoadSummaryRepo.new(
          cooling_peak_conditions,
          heating_peak_conditions,
          engineering_check_for_coolings,
          engineering_check_for_heatings,
          estimated_cooling_peak_load_component_tables,
          estimated_heating_peak_load_component_tables
      )

      cooling_peak_conditions.expect :find_by_name, "foo", [name]
      heating_peak_conditions.expect :find_by_name, "foo", [name]
      engineering_check_for_coolings.expect :find_by_name, "foo", [name]
      engineering_check_for_heatings.expect :find_by_name, "foo", [name]
      estimated_cooling_peak_load_component_tables.expect :find_by_name, "foo", [name]
      estimated_heating_peak_load_component_tables.expect :find_by_name, "foo", [name]

      expected = SystemsAnalysisReport::Models::ZoneLoadSummary.new(name, "foo", "foo", "foo", "foo", "foo", "foo")

      result = zone_load_summarys_repo.find(name)

      result.must_equal expected
    end
  end
end

