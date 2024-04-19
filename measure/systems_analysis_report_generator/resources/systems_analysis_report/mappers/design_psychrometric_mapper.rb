module SystemsAnalysisReport
  module Mappers
    class DesignPsychrometricMapper < Mapper
      attr_accessor :design_psychrometric_summary_mapper

      def initialize(design_psychrometric_summary_mapper=Mappers::DesignPsychrometricSummaryMapper.new)
        @design_psychrometric_summary_mapper = design_psychrometric_summary_mapper
      end

      def klass
        Models::DesignPsychrometric
      end

      def call(coil_sizing_detail, location)
        result = klass.new

        result.summary = @design_psychrometric_summary_mapper.(coil_sizing_detail, location)
        if coil_sizing_detail.coil_entering_air_drybulb_at_ideal_loads_peak.to_i == -999
          result.entering_coil = Models::AirStatePoint.new(24, 0.0082)
        else
          result.entering_coil = Models::AirStatePoint.new(coil_sizing_detail.coil_entering_air_drybulb_at_ideal_loads_peak, coil_sizing_detail.coil_entering_air_humidity_ratio_at_ideal_loads_peak)
        end

        if coil_sizing_detail.coil_leaving_air_drybulb_at_ideal_loads_peak.to_i == -999
          result.leaving_coil = Models::AirStatePoint.new(12.8, 0.0082)
        else
          result.leaving_coil = Models::AirStatePoint.new(coil_sizing_detail.coil_leaving_air_drybulb_at_ideal_loads_peak, coil_sizing_detail.coil_leaving_air_humidity_ratio_at_ideal_loads_peak)
        end

        if coil_sizing_detail.outdoor_air_drybulb_at_ideal_loads_peak.to_i == -999
          result.outdoor_air = Models::AirStatePoint.new(28.3, 0.0059)
        else
          result.outdoor_air = Models::AirStatePoint.new(coil_sizing_detail.outdoor_air_drybulb_at_ideal_loads_peak, coil_sizing_detail.outdoor_air_humidity_ratio_at_ideal_loads_peak)
        end

        if coil_sizing_detail.system_return_air_drybulb_at_ideal_loads_peak.to_i == -999
          result.return_air = Models::AirStatePoint.new(23.9, 0.0082)
        else
          result.return_air = Models::AirStatePoint.new(coil_sizing_detail.system_return_air_drybulb_at_ideal_loads_peak, coil_sizing_detail.system_return_air_humidity_ratio_at_ideal_loads_peak)
        end

        if coil_sizing_detail.zone_air_drybulb_at_ideal_loads_peak.to_i == -999
          result.zone = Models::AirStatePoint.new(23.9, 0.0082)
        else
          result.zone = Models::AirStatePoint.new(coil_sizing_detail.zone_air_drybulb_at_ideal_loads_peak, coil_sizing_detail.zone_air_humidity_ratio_at_ideal_loads_peak)
        end

        result
      end
    end
  end
end