json.array! @dates do |date|
  json.date date
  json.items @journal_entries.select { |je| current_user.convert_to_their_timezone(je.logged_at).strftime("%a, %b %e") == date } do |journal_entry|
    json.partial! journal_entry, partial: "api/journal_entries/journal_entry", as: :journal_entry
  end
end
