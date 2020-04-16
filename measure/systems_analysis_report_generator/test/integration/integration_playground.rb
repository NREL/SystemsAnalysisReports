require 'openstudio'
require_relative '../../resources/systems_analysis_report'

model = OpenStudio::Model::Model.load("/Users/npflaum/Downloads/OneDrive_2_4-12-2020/in.osm").get
sql_file = OpenStudio::SqlFile.new("/Users/npflaum/Downloads/OneDrive_2_4-12-2020/eplusout.sql")
container = SystemsAnalysisReport.container(model, sql_file)
report = container.json_generator.generate
open('sample.json', 'w') do |f|
  f.puts report.to_json
end