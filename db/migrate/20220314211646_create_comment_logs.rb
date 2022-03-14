class CreateCommentLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :comment_logs do |t|
      t.references :owned_by, references: :user
      t.references :parent, polymorphic: true, optional: true
      t.string :note
      t.timestamps
    end
  end
end
