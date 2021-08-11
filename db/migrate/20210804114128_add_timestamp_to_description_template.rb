class AddTimestampToDescriptionTemplate < ActiveRecord::Migration[6.0]
  def change
     add_timestamps :description_templates, null: false, default: -> { 'NOW()' }
  end
end
