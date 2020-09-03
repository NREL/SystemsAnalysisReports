module EPlusOut
  module Utilities
    class SIUnitSystem
      attr_reader :converter

      UNIT_LABEL = {
          "Btu/h" => "W",
          "ft2" => "m^2",
          "Btu/h-ft2" => "W/m^2",
          "F" => "C",
          "ft3/min" => "m^3/s",
          "ft3/min-ft2" => "m^3/s*m^2",
          "ft3-h/min-Btu" => "m^3/s*W",
          "ft2-h/Btu" => "m^2/W"
      }

      def initialize(converter=Converter.new)
        @converter = converter
      end

      def to_unit_system(value, unit)
        to_unit = UNIT_LABEL[unit]
        converter.convert(value, unit, to_unit)
      end
    end
  end
end
