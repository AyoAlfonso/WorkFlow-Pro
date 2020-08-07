class AddJsonRepresentationToQuestionnaireAttempts < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaire_attempts, :json_representation, :text
  end
end
