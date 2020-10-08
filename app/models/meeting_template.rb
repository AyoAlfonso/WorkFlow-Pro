class MeetingTemplate < ApplicationRecord
  has_many :steps
  has_many :meetings

  enum meeting_type: { team_weekly: 0, personal_weekly: 1}
  accepts_nested_attributes_for :steps, allow_destroy: true

  scope :optimized, -> { includes([{steps: :image_attachment}]) }
  scope :with_name, -> (name) { where(name: name) }
  #TODO: embedded link may be a setting on the user's components for meetings
  #each company may have a separate embedded link.

  def total_duration
    steps.sum(:duration)
  end
end
