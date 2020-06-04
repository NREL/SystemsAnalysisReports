module SystemsAnalysisReport
  module Configuration
    class JSONWriter
      CONFIG_UNITS_TO_HTML = {
      "watts": "W",
      "kilowatts": "kW",
      "britishThermalUnitsPerSecond": "btu/s",
      "britishThermalUnitsPerHour": "btu/hr",
      "fahrenheit": "F",
      "celsius": "C",
      "kelvin": "K",
      "rankine": "R",
      "fahrenheitInterval": "F",
      "celsiusInterval": "C",
      "kelvinInterval": "K",
      "rankineInterval": "R",
      "kilograms": "kg",
      "tonnes": "ton",
      "usTonnesMass": "us_ton",
      "poundsMass": "lb",
      "cubicFeetPerHour": "ft3/hr",
      "cubicFeetPerMinute": "ft3/min",
      "cubicMetersPerHour": "m3/hr",
      "cubicMetersPerSecond": "m3/s",
      "litersPerHour": "l/hr",
      "litersPerMinute": "l/min",
      "litersPerSecond": "l/s",
      "usGallonsPerHour": "us_gal/hr",
      "usGallonsPerMinute": "us_gal/min",
      "joulesPerGramDegreeCelsius": "J/g/C",
      "britishThermalUnitsPerPoundDegreeFahrenheit": "btu/lb/F",
      "joulesPerKilogramDegreeCelsius": "J/kg/C",
      "kilogramsPerCubicMeter": "kg/m3",
      "poundsMassPerCubicFoot": "lb/ft3",
      "poundsMassPerCubicInch": "lb/in3",
      "fixed": "unitless",
      "percentage": "percent",
      "wattsPerSquareFoot": "W/ft2",
      "wattsPerSquareMeter": "W/m2",
      "britishThermalUnitsPerHourSquareFoot": "btu/hr/ft2",
      "cubicFeetPerMinuteSquareFoot": "ft3/min/ft2",
      "litersPerSecondSquareMeter": "l/s/m2",
      "cubicFeetPerMinuteTonOfRefrigeration": "ft3/min/ton_r",
      "litersPerSecondKilowatt": "l/s/kW",
      "squareFeet": "ft2",
      "squareInches": "in2",
      "squareMeters": "m2",
      "squareCentimeters": "cm2",
      "squareMillimeters": "mm2",
      "acres": "ac",
      "hectares": "ha",
      "squareMetersPerKilowatt": "m2/kW",
      "squareFeetPer1000BritishThermalUnitsPerHour": "ft2/kbtu/hr"
      }

      def self.call(config)
        units = config.units
        <<-EOS
        language: "#{config.language}"
        units: {
          heat_transfer_rate:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_heating_load.to_sym]}"],decimals:0},
          temperature:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_temperature.to_sym]}"],decimals:1},
          temperature_difference:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_temperaturedifference.to_sym]}"],decimals:1},
          humidity_ratio:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.mass.to_sym]}/#{CONFIG_UNITS_TO_HTML[units.mass.to_sym]}"],decimals:4},
          flow_rate:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_airflow.to_sym]}"],decimals:1},
          specific_heat:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_specificheat.to_sym]}"],decimals:3},
          density:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_density.to_sym]}"],decimals:3},
          percent:{conversion:Fn["percent"],decimals:1},
          outdoor_air_percentage:{conversion:Fn["percent"],decimals:2},
          heat_transfer_rate_per_area:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_heating_load_divided_by_area.to_sym]}"],decimals:2},
          area_per_heat_transfer_rate:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_area_divided_by_heating_load.to_sym]}"],decimals:2},
          flow_rate_per_area:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_airflow_density.to_sym]}"],decimals:2},
          flow_rate_per_heat_transfer_rate:{conversion:Fn["#{CONFIG_UNITS_TO_HTML[units.hvac_airflow_divided_by_cooling_load.to_sym]}"],decimals:2},
          people:{conversion:Fn["unitless"],label:null,decimals:1},
          area:{conversion:Fn["area"],decimals:1}
        }
        EOS
      end
    end
  end
end