class CreateQuestionnaireAttempts < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :questionnaire, null: false, foreign_key: true
      t.text :answers
      t.text :steps
      t.text :rendered_steps
      t.datetime :completed_at

      t.timestamps
    end
  end
end
