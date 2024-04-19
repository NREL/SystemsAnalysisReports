require_relative 'resources/systems_analysis_report'

class SystemsAnalysisReportGenerator < OpenStudio::Measure::ReportingMeasure
  # human readable name
  def name
    # Measure name should be the title case of the class name.
    return 'Systems Analysis Report Generator'
  end

  # human readable description
  def description
    return ''
  end

  # human readable description of modeling approach
  def modeler_description
    return ''
  end

  # define the arguments that the user will input
  def arguments(model)
    args = OpenStudio::Measure::OSArgumentVector.new

    debug = OpenStudio::Measure::OSArgument.makeBoolArgument("debug", false)
    debug.setDisplayName("Debug")
    debug.setDefaultValue(false)
    args << debug
    # this measure does not require any user arguments, return an empty list

    return args
  end

  # define the outputs that the measure will create
  def outputs
    outs = OpenStudio::Measure::OSOutputVector.new

    # this measure does not produce machine readable outputs with registerValue, return an empty list

    return outs
  end

  # return a vector of IdfObject's to request EnergyPlus objects needed by the run method
  # Warning: Do not change the name of this method to be snake_case. The method must be lowerCamelCase.
  def energyPlusOutputRequests(runner, user_arguments)
    super(runner, user_arguments)

    # return result
  end

  # define what happens when the measure is run
  def run(runner, user_arguments)
    super(runner, user_arguments)
    model, sql_file = SystemsAnalysisReportGenerator.get_model_and_sql_file(runner)
    container = SystemsAnalysisReport.container(model, sql_file)

    bundle_input_dir = "#{File.dirname(__FILE__)}/resources/build"
    web_config = SystemsAnalysisReport::Config.new({file_path:self.class.get_config_path(runner)})
    data = container.json_generator.generate.to_json
    data.

    SystemsAnalysisReport::Strategies::WebAppWriter.(bundle_input_dir, data, web_config)

    debug = runner.getBoolArgumentValue("debug", user_arguments)
    File.write('./report_data.json', data) if debug

    sql_file.close

    return true
  end

  def self.get_model_and_sql_file(runner)
    model = runner.lastOpenStudioModel

    if model.empty?
      runner.registerError('Cannot find last model.')
    else
      model = model.get
    end

    sql_file = nil
    # require 'find'
    # run_dir = runner.workflow.runDir.to_s
    # Find.find(run_dir) do |path|
    #   if File.directory?(path) && File.basename(path).include?('revit_analyze_all_electric_hvac_systems')
    #     sizing_sql_path = File.join(path, 'SizingRun/run/eplusout.sql')
    #     if File.exist?(sizing_sql_path)
    #       puts sizing_sql_path
    #       sql_file = OpenStudio::SqlFile.new(OpenStudio::Path.new(sizing_sql_path))
    #     end
    #   end
    # end

    if sql_file.nil?
      sql_file = runner.lastEnergyPlusSqlFile

      if sql_file.empty?
        runner.registerError('Cannot find last sql file.')
      else
        sql_file = sql_file.get
      end
    end

    return model, sql_file
  end

  def self.get_config_path(runner)
    file_path = runner.workflow.findFile('reportConfig.json')
    unless file_path.empty?
      file_path = file_path.get if file_path.is_initialized
      return file_path.to_s if File.exists? file_path.to_s
    else
      runner.registerWarning("Could not find reportConfig.json in root. Using default configuration instead")
    end

    file_path = "#{File.dirname(__FILE__)}/resources/build/reportConfig.json"
    return file_path if File.exist? file_path

    raise LoadError('No configuration file can be found')
  end
end

# register the measure to be used by the application
SystemsAnalysisReportGenerator.new.registerWithApplication
