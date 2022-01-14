class MeetingTemplate < ApplicationRecord
  has_many :steps
  has_many :meetings

  #GOTCHA: Whenever you add a new type, please add it to the meeting_instance_finder service
  enum meeting_type: {
    team_weekly: 0,
    personal_weekly: 1,
    forum_monthly: 2,
    personal_monthly: 3,
    personal_daily: 10
  }
  # for new meeting types past the basics, all personals are 1X, teams are 2X, team daily 20 is skipped
  #personal_monthly: 12,
  #team_monthly: 22,
  #team_quarterly: 23,
  #team_annual: 24

  accepts_nested_attributes_for :steps, allow_destroy: true

  scope :optimized, -> { includes([{ steps: :image_attachment }]) }
  scope :with_name, ->(name) { where(name: name) }
  #TODO: embedded link may be a setting on the user's components for meetings
  #each company may have a separate embedded link.
  
  def total_duration
    #TODO: ADD CONDITIONAL TO LOOK FOR ANY OVERRIDE SETTINGS AND +/- THE DURATION
    #THIS NEEDS TO HAPPEN ON THE INDIVIDUAL STEP TOO (IN JBUILDER DECORATOR)
    steps.sum(:duration)
  end
end
