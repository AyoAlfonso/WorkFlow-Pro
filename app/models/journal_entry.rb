class JournalEntry < ApplicationRecord
  belongs_to :generated_from, optional: true
  belongs_to :user
end
