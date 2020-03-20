module SystemsAnalysisReport
  module Models
    SystemAirflow = Struct.new(:main_fan, :ventilation) do
      include Models::Model
    end
  end
end