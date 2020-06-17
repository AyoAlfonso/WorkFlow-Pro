class WeeklyMeeting < ApplicationRecord
  include HasCreator
  has_many :meeting_ratings
end
