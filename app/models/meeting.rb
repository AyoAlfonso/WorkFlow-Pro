class Meeting < ApplicationRecord
  belongs_to :team
  belongs_to :meeting_template
end
