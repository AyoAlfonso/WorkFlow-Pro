class UserActivityLog < ApplicationRecord
  belongs_to :user
  belongs_to :company

  scope :owned_by_user, ->(user) { where(user_id: user.id) }
  scope :sort_by_company, ->(company) { where(company_id: company.id) }

  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :sort_by_created_date, -> { order(created_at: :desc) }
end
