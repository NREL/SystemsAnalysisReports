require_relative '../../test_helper'

include SystemsAnalysisReport::Mappers

describe Mapper do
  describe "#klass" do
    it "must raise a NotImplementedError" do
      mapper = Mapper.new
      assert_raises NotImplementedError do
        mapper.klass
      end
    end
  end

  describe "#mapping" do
    it "must raise a NotImplementedError" do
      mapper = Mapper.new
      assert_raises NotImplementedError do
        mapper.mapping
      end
    end
  end

  describe "#call" do
    before do
      Foo = Struct.new(:bar, :baz)
      Quu = Struct.new(:quux, :quuz)

      class FooToQuuMapper < SystemsAnalysisReport::Mappers::Mapper
        def mapping
          [[:bar, :quuz], [:baz, :quux]]
        end

        def klass
          Quu
        end
      end
    end

    let(:foo) {Foo.new("beep", "boop")}

    it "maps from object to another" do
      mapper = FooToQuuMapper.new()

      expected = Quu.new("boop", "beep")
      result = mapper.(foo)

      result.must_equal expected
    end
  end
end