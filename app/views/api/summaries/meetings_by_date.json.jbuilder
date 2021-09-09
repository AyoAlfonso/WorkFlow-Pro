json.array! @dates do |date|
  json.date date
  json.items @meetings.select { |meeting| current_user.convert_to_their_timezone(meeting.start_time).strftime("%a, %b %e") == date } do |meeting|
    json.partial! meeting, partial: "api/meetings/meeting", as: :meeting
  end
end
