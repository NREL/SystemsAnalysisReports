module SystemsAnalysisReport
  module Mappers
    class Mapper
      def mapping
        raise NotImplementedError, "Must be implemented by the subclass"
      end

      def klass
        raise NotImplementedError, "Must be implemented by the subclass"
      end

      def call(from)
        result = klass.new

        mapping.each do |param|
          result.send("#{param[1]}=", from.send(param[0]))
        end

        return result
      end
    end
  end
end