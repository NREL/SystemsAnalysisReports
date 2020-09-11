require 'openstudio'
require_relative '../../resources/eplusout'
require_relative '../../resources/systems_analysis_report'

# sql_file = OpenStudio::SqlFile.new("C:/Users/t_pflan/AppData/Local/Temp/1/11f015c5-000d-4992-8fae-fef4cbc8c6b5/HVAC Systems Loads and Sizing/run/eplusout.sql")
# eplusout = EPlusOut.container(sql_file)
#
#
# puts eplusout.estimated_cooling_peak_load_component_tables.first
# puts eplusout.locations.first
# puts eplusout.estimated_cooling_peak_load_component_tables.instances

sql_file = OpenStudio::SqlFile.new('C:\Users\t_pflan\Downloads\Annual Building Energy Simulation (1)\Annual Building Energy Simulation\run\eplusout.sql')
model = OpenStudio::Model::Model.load('C:\Users\t_pflan\Downloads\Annual Building Energy Simulation (1)\Annual Building Energy Simulation\run\in.osm').get

systems_analysis_report = SystemsAnalysisReport.container(model, sql_file)
data = systems_analysis_report.json_generator.generate
puts data.to_json