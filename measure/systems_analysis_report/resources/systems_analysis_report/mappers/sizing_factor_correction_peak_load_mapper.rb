module SystemsAnalysisReport
  module Mappers
    class SizingFactorCorrectionPeakLoadMapper < Mapper
      def klass
        EPlusOut::Models::EstimatedPeakLoadComponent
      end

      def mapping
        [
            [:difference_due_to_sizing_factor, :sensible_instant]
        ]
      end
    end
  end
end