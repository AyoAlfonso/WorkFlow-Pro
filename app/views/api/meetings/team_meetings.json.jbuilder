json.array! @meetings.sort_by_creation_date, partial: "api/meetings/meeting", as: :meeting