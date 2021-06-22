class AddLogDateToJournalEntry < ActiveRecord::Migration[6.0]
  def change
    add_column :journal_entries, :logged_at, :datetime
    add_index :journal_entries, :logged_at
  end

  def data
    JournalEntry.where(logged_at: nil).update_all("logged_at = created_at")
  end
end
