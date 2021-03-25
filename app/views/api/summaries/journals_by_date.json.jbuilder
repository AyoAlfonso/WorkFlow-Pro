json.array! @dates do |date|
  json.date date
  json.items @journal_entries do |journal_entry|
    json.partial! journal_entry, partial: 'api/journal_entries/journal_entry', as: :journal_entry
  end
end
