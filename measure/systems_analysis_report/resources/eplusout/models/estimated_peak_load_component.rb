module EPlusOut
  module Models
    EstimatedPeakLoadComponent = Struct.new(
        :percent_grand_total,
        :latent,
        :related_area,
        :sensible_delayed,
        :sensible_instant,
        :sensible_return_air,
        :total,
        :total_per_area,
    ) do
      include Models::Model
    end
  end
end
