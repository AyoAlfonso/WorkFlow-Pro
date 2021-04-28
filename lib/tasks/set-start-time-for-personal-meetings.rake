namespace :personal_meetings do
  desc "update emotion scores"
  task start_time: :environment do
    Meeting.all.each do |meeting|
      if meeting.meeting_type ==  "personal_weekly" || meeting.meeting_type == "personal_daily" && meeting.start_time.nil?
        meeting.update!(start_time: meeting.created_at)
      end
    end
  end
end