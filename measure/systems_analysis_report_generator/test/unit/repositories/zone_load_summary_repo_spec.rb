require_relative '../../test_helper'

include SystemsAnalysisReport::Repositories

describe ZoneLoadSummaryRepo do
  describe "#find" do
    let(:cooling_peak_conditions) { Mock.new }
    let(:heating_peak_conditions) { Mock.new }
    let(:engineering_check_for_coolings) { Mock.new }
    let(:engineering_check_for_heatings) { Mock.new }
    let(:estimated_cooling_peak_load_component_tables) { Mock.new }
    let(:estimated_heating_peak_load_component_tables) { Mock.new }
    let(:mapper) { Mock.new }

    let(:zone_load_summarys_repo) { SystemsAnalysisReport::Repositories::ZoneLoadSummaryRepo.new(
        cooling_peak_conditions,
        heating_peak_conditions,
        engineering_check_for_coolings,
        engineering_check_for_heatings,
        estimated_cooling_peak_load_component_tables,
        estimated_heating_peak_load_component_tables,
        mapper
    )}

    it "returns a constructed ZoneLoadSummary" do
      name = "zone 1"

      cooling_peak_conditions.expect :find_by_name, "cooling", [name]
      heating_peak_conditions.expect :find_by_name, "heating", [name]
      engineering_check_for_coolings.expect :find_by_name, "cooling", [name]
      engineering_check_for_heatings.expect :find_by_name, "heating", [name]
      estimated_cooling_peak_load_component_tables.expect :find_by_name, "cooling", [name]
      estimated_heating_peak_load_component_tables.expect :find_by_name, "heating", [name]
      mapper.expect :call, "foo", ["cooling", "cooling", "cooling"]
      mapper.expect :call, "bar", ["heating", "heating", "heating"]

      expected = SystemsAnalysisReport::Models::CoolingAndHeating.new(name, "foo", "bar")

      result = zone_load_summarys_repo.find(name)

      result.must_equal expected
    end

    it "returns a nil when all relations don't return anything" do
      name = "zone 1"

      cooling_peak_conditions.expect :find_by_name, nil, [name]
      heating_peak_conditions.expect :find_by_name, nil, [name]
      engineering_check_for_coolings.expect :find_by_name, nil, [name]
      engineering_check_for_heatings.expect :find_by_name, nil, [name]
      estimated_cooling_peak_load_component_tables.expect :find_by_name, nil, [name]
      estimated_heating_peak_load_component_tables.expect :find_by_name, nil, [name]

      result = zone_load_summarys_repo.find(name)

      result.must_be_nil
    end
  end
end

