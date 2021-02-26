class AddUserIdAndCompanyIdToTags < ActiveRecord::Migration[6.0]
  def change
    add_reference :tags, :user, null: true, foreign_key: true
    add_reference :tags, :company, null: true, foreign_key: true
  end
end
