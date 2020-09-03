require 'openstudio'
require_relative '../../resources/systems_analysis_report'
# require 'memory_profiler'

# start = Time.now
# model = OpenStudio::Model::Model.load("/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report_generator/test/functional/run/in.osm").get
# puts ("Loading the model took #{Time.now - start}s")
#
# start = Time.now
# sql_file = OpenStudio::SqlFile.new("/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report_generator/test/functional/run/eplusout.sql")
# puts ("Loading the SqlFile took #{Time.now - start}s")
#
# start = Time.now
# container = SystemsAnalysisReport.container(model, sql_file)
# puts ("Loading the Systems Analysis Report container took #{Time.now - start}s")
#
# # start = Time.now
# # puts container.design_psychrometric_service.(model).to_json
# # puts ("Loading Design Psychrometrics took #{Time.now - start}s")
# # #
# # start = Time.now
# # result = container.zone_load_summary_service.(model)
# # puts result
# # puts ("Loading Zone Load Summaries took #{Time.now - start}s")
#
# start = Time.now
# report = container.json_generator.generate
# puts ("Report Generation took #{Time.now - start}s")
#
# start = Time.now
# report.to_json
# puts ("Report translation to JSON took #{Time.now - start}s")
#
#
require 'open3'
def run_command(command)
  stdout_str, stderr_str, status = Open3.capture3({}, command)
  if status.success?
    puts "Command completed successfully"
    puts "stdout: #{stdout_str}"
    puts "stderr: #{stderr_str}"
    return true
  else
    puts "Error running command: '#{command}'"
    puts "stdout: #{stdout_str}"
    puts "stderr: #{stderr_str}"
    return false
  end
end
#
# osw_in_path = Config::TEST_OUTPUT_PATH + '/cav_box/in.osw'
# cmd = "\"#{Config::CLI_PATH}\" run -w \"#{osw_in_path}\""
cmd = "openstudio run -p -w 'C:\\Users\\t_pflan\\Documents\\GitHub\\SystemsAnalysisReports\\measure\\systems_analysis_report_generator\\test\\functional\\input.osw'" #'C:/Users/t_pflan/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report_generator/test/functional/input.osw'"
run_command(cmd)
open('sample.json', 'w') do |f|
  f.puts report.to_json
end
#
# require 'openstudio-workflow'
# osw_path = '/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report_generator/test/functional/input.osw'
# run_options = {}
# run_options[:debug] = true
# run_options[:fast] = true
# run_options[:model_idf] = [1]
# run_options[:skip_expand_objects] = true
# run_options[:skip_energyplus_preprocess] = true
# run_options[:jobs] = [
#     { state: :queued, next_state: :initialization, options: { initial: true } },
#     { state: :initialization, next_state: :reporting_measures, job: :RunInitialization,
#       file: 'openstudio/workflow/jobs/run_initialization.rb', options: {} },
#     { state: :reporting_measures, next_state: :postprocess, job: :RunReportingMeasures,
#       file: 'openstudio/workflow/jobs/run_reporting_measures.rb', options: {} },
#     { state: :postprocess, next_state: :finished, job: :RunPostprocess,
#       file: 'openstudio/workflow/jobs/run_postprocess.rb', options: {} },
#     { state: :finished },
#     { state: :errored }
# ]
# run_options[:preserve_run_dir] = true
# k = OpenStudio::Workflow::Run.new osw_path, run_options
#
# # $logger.debug "Beginning run"
# k.run