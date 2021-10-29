class CheckInTemplate < ApplicationRecord
  has_many :check_in_templates_steps

  enum check_in_type: {
    weekly_check_in: 0,
  }

  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

  scope :with_name, ->(name) { where(name: name) }
end
