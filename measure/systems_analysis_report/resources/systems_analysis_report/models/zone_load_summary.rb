module SystemsAnalysisReport
  module Models
    ZoneLoadSummary = Struct.new(:name, :cooling_peak_condition, :engineering_check_for_cooling, :engineering_check_for_heating,
      :estimated_cooling_peak_load_component_table, :estimated_heating_peak_load_component_table, :heating_peak_condition) do

      include SystemsAnalysisReport::Models::Model
    end
  end
end
