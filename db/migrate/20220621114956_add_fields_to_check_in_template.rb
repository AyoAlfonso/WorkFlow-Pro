class AddFieldsToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :participants, :jsonb 
    add_column :check_in_templates, :anonymous, :boolean 
    add_column :check_in_templates, :run_once, :datetime 
    add_column :check_in_templates, :tag, :string, array: true, default: []  
    add_column :check_in_templates, :date_time_config, :jsonb 
    add_column :check_in_templates, :time_zone, :integer, default: 0
    add_column :check_in_templates, :reminder, :jsonb
  end
end
