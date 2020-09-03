require 'openstudio'
require_relative '../../resources/eplusout'

sql_file = OpenStudio::SqlFile.new("C:/Users/t_pflan/AppData/Local/Temp/1/11f015c5-000d-4992-8fae-fef4cbc8c6b5/HVAC Systems Loads and Sizing/run/eplusout.sql")
eplusout = EPlusOut.container(sql_file)


puts eplusout.estimated_cooling_peak_load_component_tables.first
puts eplusout.estimated_cooling_peak_load_component_tables.instances
