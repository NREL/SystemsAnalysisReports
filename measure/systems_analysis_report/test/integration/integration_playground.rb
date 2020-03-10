require 'openstudio'
require_relative '../../resources/systems_analysis_report'

model = OpenStudio::Model::Model.load("/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report/test/fixtures/in.osm").get
sql_file = OpenStudio::SqlFile.new("/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report/test/fixtures/eplusout.sql")
container = SystemsAnalysisReport.container(model, sql_file)
report = container.json_generator.generate
puts report.to_json
# puts zone_load_summarys_repo.find("ZONE EQUIPMENT 1-1").to_json