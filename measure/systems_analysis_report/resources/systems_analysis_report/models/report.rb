module SystemsAnalysisReport
  module Models
    Report = Struct.new(:zone_load_summarys, :system_load_summarys, :design_psychrometrics) do
      include SystemsAnalysisReport::Models::Model
    end
  end
end