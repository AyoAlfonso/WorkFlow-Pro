class AddOnboardingStatusToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :onboarding_status, :integer, default: 0
  end
end
