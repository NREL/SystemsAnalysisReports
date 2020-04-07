module SystemsAnalysisReport
  module Mappers
    class VentilationPeakLoadComponentMapper < Mapper
      def klass
        EPlusOut::Models::EstimatedPeakLoadComponent
      end

      def mapping
        [
            [:latent_load, :latent],
            [:sensible_load, :sensible_instant],
            [:total_load, :total]
        ]
      end
    end
  end
end