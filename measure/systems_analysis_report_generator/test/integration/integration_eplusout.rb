require 'openstudio'
require_relative '../../resources/eplusout'

sql_file = OpenStudio::SqlFile.new("/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/measure/systems_analysis_report_generator/test/fixtures/air_system_4_zone/eplusout.sql")
eplusout = EPlusOut.container(sql_file)

start = Time.now
# eplusout.estimated_cooling_peak_load_component_tables.find_by_name("")
puts (Time.now - start)

start = Time.now
# eplusout.estimated_cooling_peak_load_component_tables.find_by_name("")
puts (Time.now - start)
require 'objspace'
puts eplusout.locations.all
puts eplusout.estimated_cooling_peak_load_component_tables.instances.count
# puts eplusout.estimated_cooling_peak_load_component_tables.instances
puts ObjectSpace.memsize_of(eplusout.estimated_cooling_peak_load_component_tables.instances)
puts ObjectSpace.memsize_of([0..572].to_a)

puts ObjectSpace.memsize_of(EPlusOut::Models::EstimatedPeakLoadComponent.new([0..7]))