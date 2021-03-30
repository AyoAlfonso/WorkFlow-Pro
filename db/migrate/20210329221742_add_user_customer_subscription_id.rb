class AddUserCustomerSubscriptionId < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :customer_subscription_profile_id, :string
  end
end
