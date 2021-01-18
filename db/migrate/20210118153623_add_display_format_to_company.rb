class AddDisplayFormatToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :display_format, :integer, default: 0
  end
end
