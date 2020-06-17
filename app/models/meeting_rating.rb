class MeetingRating < ApplicationRecord
  belongs_to :user
  belongs_to :weekly_meeting
end
