class Step < ApplicationRecord
  belongs_to :meeting_template

  enum step_type: { image: 0, component: 1 }
end
