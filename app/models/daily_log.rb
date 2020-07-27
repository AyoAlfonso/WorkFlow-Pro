class DailyLog < ApplicationRecord
  belongs_to :user
  enum work_status: { in_office: 0, work_from_home: 1, half_day: 2, day_off: 3 }
end
