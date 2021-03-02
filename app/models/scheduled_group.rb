class ScheduledGroup < ApplicationRecord
  has_many :key_activities
  has_many :issues
end
