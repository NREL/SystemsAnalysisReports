require_relative '../test_helper'

include SystemsAnalysisReport::ReportGenerators

# describe SystemsAnalysisReport do
#   describe "#run" do
#     it "parses the input arguments and generates a report" do
#       sql_file = Object.new
#       container = Object.new
#
#       report_generator = JSONGenerator.new(container)
#       EPlusOut::Container.default_configuration(sql_file)
#
#       expected = {}
#
#       result = report_generator.generate()
#
#       SystemsAnalysisReport.stub :get_last_sql_file, sql_file do
#       end
#
#       result.must_equal expected
#     end
#   end
# end