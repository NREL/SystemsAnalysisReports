module SystemsAnalysisReport
  module Strategies
    class HtmlInjector
      def self.call(path, data)
        file = File.read(path)
        text = file.sub!("function(e){e.exports=JSON.parse()", "function(e){e.exports=JSON.parse(#{data})")
        File.write(path, text)
      end
    end
  end
end

# path = "/Users/npflaum/Documents/GitHub/SystemsAnalysisReports/build/bundle.js"
# SystemsAnalysisReport::Strategies::HtmlInjector.(path, "test")