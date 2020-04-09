require_relative '../../test_helper'

include SystemsAnalysisReport::ReportGenerators

describe JSONGenerator do
  describe "#generate" do
    it "creates and populates a report" do
      model = Object.new
      zone_load_summarys_service, system_load_summarys_service, design_psychrometrics_service = Mock.new, Mock.new, Mock.new
      zone_load_summarys, system_load_summarys, design_psychrometrics = Object.new, Object.new, Object.new

      generator = JSONGenerator.new(model, zone_load_summarys_service, system_load_summarys_service, design_psychrometrics_service)

      zone_load_summarys_service.expect :call, zone_load_summarys, [model]
      system_load_summarys_service.expect :call, system_load_summarys, [model]
      design_psychrometrics_service.expect :call, design_psychrometrics, [model]

      expected = SystemsAnalysisReport::Models::Report.new
      expected.zone_load_summarys = zone_load_summarys
      expected.system_load_summarys = system_load_summarys
      expected.design_psychrometrics = design_psychrometrics

      result = generator.generate

      result.must_equal expected
    end
  end
end
