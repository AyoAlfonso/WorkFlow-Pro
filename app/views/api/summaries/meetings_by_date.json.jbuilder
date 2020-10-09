json.array! @dates do |date|
  json.date date
  json.items @meetings.select { |meeting| meeting.start_time.strftime("%a, %b%e") == date } do |meeting|
    json.partial! meeting, partial: 'api/meetings/meeting', as: :meeting
  end
end
