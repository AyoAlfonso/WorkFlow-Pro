class MeetingTemplate < ApplicationRecord
  belongs_to :team
  has_many :steps
  has_many :meetings

  enum meeting_type: { leadership_weekly: 0, personal_weekly: 1}
end
