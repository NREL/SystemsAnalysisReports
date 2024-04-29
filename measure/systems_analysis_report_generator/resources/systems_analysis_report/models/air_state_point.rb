module SystemsAnalysisReport
  module Models
    AirStatePoint = Struct.new(:dry_bulb_temperature, :humidity_ratio) do
      include Models::Model

      def validate
        puts "#{self.dry_bulb_temperature}, #{self.humidity_ratio}"
      end
    end
  end
end