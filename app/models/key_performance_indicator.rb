class KeyPerformanceIndicator < ApplicationRecord

    enum unit_type: { percentage: 0, numerical: 1, currency: 2 }.freeze
      
end
