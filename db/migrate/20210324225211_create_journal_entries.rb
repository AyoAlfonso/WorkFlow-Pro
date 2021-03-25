include JournalEntryHelper #remove this from migration if no longer required after
class CreateJournalEntries < ActiveRecord::Migration[6.0]
  def change
    create_table :journal_entries do |t|
      t.text :body
      t.references :generated_from, polymorphic: true, index: {name: 'index_journal_entries_on_generated_from_polymorphic'}
      t.references :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end

  def data
    #all questionnaire attempts json data is copied into journal entries
    #utilize the journal serilaizer to convert a json questionnaire attmpet to rich text
    QuestionnaireAttempt.find_each do |qa|
      parsed_body = questionnaire_attempt_to_text(qa.rendered_steps)
      JournalEntry.create!(generated_from_type: qa.class.name, generated_from_id: qa.id, body: parsed_body, user_id: qa.user_id) if parsed_body.present?
    end
  end
end
