require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe EstimatedPeakLoadComponentTableToPeakLoadComponentTable do
  describe "#call" do
    it 'maps to a Peak Load Component Table correctly' do
      seed = Array.new(27) { EPlusOut::Models::EstimatedPeakLoadComponent.new(5) { rand(1..10) }}

      estimated_peak_load_component_table = EPlusOut::Models::EstimatedPeakLoadComponentTable.new("test", *seed)

      result = EstimatedPeakLoadComponentTableToPeakLoadComponentTable.new.(estimated_peak_load_component_table)

      result.values.must_equal SystemsAnalysisReport::Models::SystemPeakLoadComponentTable
    end
  end
end