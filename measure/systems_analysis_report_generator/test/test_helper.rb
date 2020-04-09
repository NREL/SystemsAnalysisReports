require 'minitest/autorun'
require 'minitest/spec'
require 'minitest/reporters'

_stderr, $stderr = $stderr, StringIO.new
require 'openstudio'
$stderr = _stderr

include Minitest

Reporters.use! Reporters::SpecReporter.new

require_relative '../resources/systems_analysis_report'