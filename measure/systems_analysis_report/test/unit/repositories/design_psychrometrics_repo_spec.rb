require_relative '../../test_helper'

include SystemsAnalysisReport::Repositories

describe DesignPsychrometricRepo do
  describe "#find" do
    it "returns a design psychrometric" do
      name = "Coil 1"
      coil_sizing_details = Mock.new
      mapper = Mock.new
      coil_sizing_detail = Object.new
      repo = DesignPsychrometricRepo.new(coil_sizing_details, mapper)

      coil_sizing_details.expect :find_by_name, coil_sizing_detail, [name]
      mapper.expect :call, Object.new, [coil_sizing_detail]

      repo.find(name)

      assert coil_sizing_details.verify
      assert mapper.verify
    end
  end
end
