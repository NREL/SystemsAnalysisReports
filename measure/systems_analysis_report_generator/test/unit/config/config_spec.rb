require_relative '../../test_helper'

include SystemsAnalysisReport

describe Config do
  describe '.new' do
    it 'builds a configuration file correctly' do
      file_path = './measure/systems_analysis_report_generator/test/unit/config/sample_config.json'
      config = Config.new({file_path: file_path})

      config.language.must_equal 'en-US'
      config.units.hvac_heating_load.must_equal 'watts'
      config.units.hvac_temperature.must_equal 'celsius'

    end
  end
end
