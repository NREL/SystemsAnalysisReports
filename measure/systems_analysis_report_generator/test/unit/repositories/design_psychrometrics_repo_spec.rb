require_relative '../../test_helper'

include SystemsAnalysisReport::Repositories

describe DesignPsychrometricRepo do
  describe "#find" do
    it "returns a design psychrometric if the relation returns data" do
      name = "Coil 1"
      coil_sizing_details = Mock.new
      mapper = Mock.new
      coil_sizing_detail = Object.new
      design_psychrometric = SystemsAnalysisReport::Models::DesignPsychrometric.new
      repo = DesignPsychrometricRepo.new(coil_sizing_details, mapper)

      coil_sizing_details.expect :find_by_name, coil_sizing_detail, [name]
      mapper.expect :call, design_psychrometric, [coil_sizing_detail]

      expected = design_psychrometric

      result = repo.find(name)

      assert coil_sizing_details.verify
      assert mapper.verify
      result.must_equal expected
    end

    it "returns nil if the relation doesn't return data" do
      name = "Coil 1"
      coil_sizing_details = Mock.new
      mapper = Mock.new
      repo = DesignPsychrometricRepo.new(coil_sizing_details, mapper)

      coil_sizing_details.expect :find_by_name, nil, [name]

      result = repo.find(name)

      assert coil_sizing_details.verify
      result.must_be_nil
    end
  end
end
