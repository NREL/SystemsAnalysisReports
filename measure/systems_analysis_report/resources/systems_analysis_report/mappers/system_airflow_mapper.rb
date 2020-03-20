module SystemsAnalysisReport
  module Mappers
    class SystemAirflowMapper
      def self.call(peak_condition)
        main_fan = peak_condition.main_fan_air_flow
        ventilation = peak_condition.outside_air_flow

        SystemsAnalysisReport::Models::SystemAirflow.new(main_fan, ventilation)
      end
    end
  end
end