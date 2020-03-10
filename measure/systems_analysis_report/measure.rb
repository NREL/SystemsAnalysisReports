class SystemsAnalysisReport < OpenStudio::Measure::ReportingMeasure
  # human readable name
  def name
    # Measure name should be the title case of the class name.
    return 'Systems Analysis Report'
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
  def arguments
    args = OpenStudio::Measure::OSArgumentVector.new

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

    return result
  end

  # define what happens when the measure is run
  def run(runner, user_arguments)
    super(runner, user_arguments)

    model, sql_file = self.get_model_and_sql_file(runner)
    eplus_out_container = EPlusOut::Container.default_configuration(sql_file)
    systems_analysis_report_container = SystemsAnalysisReport::Container.default_configuration(model, eplus_out_container)

    # Instantiate all needed dependencies (gateways, repositories, etc.)
    # generate the report json
    # inject json into the html_file

    # get the last model and sql file
    model = runner.lastOpenStudioModel
    if model.empty?
      runner.registerError('Cannot find last model.')
      return false
    end
    model = model.get

    sql_file = runner.lastEnergyPlusSqlFile
    if sql_file.empty?
      runner.registerError('Cannot find last sql file.')
      return false
    end
    sql_file = sql_file.get
    model.setSqlFile(sql_file)

    # close the sql file
    sql_file.close

    return true
  end

  def self.get_model_and_sql_file(runner)
    model = runner.lastOpenStudioModel
    sql_file = runner.lastEnergyPlusSqlFile

    if model.empty?
      runner.registerError('Cannot find last model.')
    end

    if sql_file.empty?
      runner.registerError('Cannot find last sql file.')
    end

    return model.get, sql_file.get
  end

  def self.create_application(sql_file, model)
    container = Canister.new
    container.register()
  end
end

# register the measure to be used by the application
SystemsAnalysisReport.new.registerWithApplication
