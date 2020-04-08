module SystemsAnalysisReport
  module Models
    SystemTemperature = Struct.new(:supply, :return, :mixed_air, :fan_heat_temperature_difference) do
      include Models::Model
    end
  end
end