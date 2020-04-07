require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe EstimatedPeakLoadComponentTableToPeakLoadComponentTable do
  describe "#call" do
    it 'maps to a Peak Load Component Table correctly' do
      seed = Array.new(27) { Array.new(5) { rand(1..10) }}

      estimated_peak_load_component_table = EPlusOut::Models::EstimatedPeakLoadComponentTable.new(*seed)

      result = EstimatedPeakLoadComponentTableToPeakLoadComponentTable.(estimated_peak_load_component_table)

      result.values.must_equal SystemsAnalysisReport::Models::PeakLoadComponentTable
    end

    it 'maps coil sizing detail to zone ventilation and fan heat peak load correctly' do
      estimated_peak_load_component_table = EPlusOut::Models::EstimatedPeakLoadComponentTable.new

      coil_sizing_detail = Mock.new
      coil_sizing_detail.expect :latent_load, 10
      coil_sizing_detail.expect :sensible_load, 20
      coil_sizing_detail.expect :total_load, 30
      coil_sizing_detail.expect :supply_fan_air_heat_gain_at_ideal_loads_peak, 500

      expected_ventilation = EPlusOut::Models::EstimatedPeakLoadComponent.new(*[0, 10, nil, 0, 20, 0, 30, 0])
      expected_fan_heat = EPlusOut::Models::EstimatedPeakLoadComponent.new(*[0, 0, nil, 0, 0, 0, 0, 0])

      result = EstimatedPeakLoadComponentTableToPeakLoadComponentTable.(estimated_peak_load_component_table, coil_sizing_detail)

      result.zone_ventilation.must_equal expected_ventilation
      result.supply_fan_heat.must_equal expected_fan_heat
    end
  end
end