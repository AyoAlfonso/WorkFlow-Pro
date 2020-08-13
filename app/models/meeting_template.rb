class MeetingTemplate < ApplicationRecord
  has_many :steps
  has_many :meetings

  enum meeting_type: { team_weekly: 0, personal_weekly: 1}
  accepts_nested_attributes_for :steps, allow_destroy: true
end
