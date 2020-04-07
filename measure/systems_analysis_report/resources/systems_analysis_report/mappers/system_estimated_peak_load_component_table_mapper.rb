module SystemsAnalysisReport
  module Mappers
    class SystemEstimatedPeakLoadComponentTableMapper
      attr_reader :peak_load_component_table_mapper, :sizing_factor_correction_mapper, :supply_fan_heat_mapper,
                  :time_delay_correction_mapper, :ventilation_mapper

      def initialize(peak_load_component_table_mapper = EstimatedPeakLoadComponentTableToPeakLoadComponentTable.new,
                     ventilation_mapper = VentilationPeakLoadComponentMapper.new,
                     supply_fan_heat_mapper = SupplyFanHeatPeakLoadMapper.new,
                     time_delay_correction_mapper = TimeDelayCorrectionPeakLoadMapper.new,
                     sizing_factor_correction_mapper = SizingFactorCorrectionPeakLoadMapper.new
      )
        @peak_load_component_table_mapper = peak_load_component_table_mapper
        @ventilation_mapper = ventilation_mapper
        @supply_fan_heat_mapper = supply_fan_heat_mapper
        @time_delay_correction_mapper = time_delay_correction_mapper
        @sizing_factor_correction_mapper = sizing_factor_correction_mapper
      end

      def call(estimated_peak_load_component_table, peak_condition, coil_sizing_detail=nil)
        result = @peak_load_component_table_mapper.(estimated_peak_load_component_table)

        if coil_sizing_detail
          result.add_load(:zone_ventilation, @ventilation_mapper.(coil_sizing_detail))
          result.add_load(:supply_fan_heat, @supply_fan_heat_mapper.(coil_sizing_detail))
        end

        if peak_condition
          result.add_load(:time_delay_correction, @time_delay_correction_mapper.(peak_condition))
          result.add_load(:sizing_factor_correction, @sizing_factor_correction_mapper.(peak_condition))
        end

        result.normalize
        result
      end
    end
  end
end
