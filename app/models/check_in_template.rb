class CheckInTemplate < ApplicationRecord
  has_many :check_in_templates_steps

  enum check_in_type: {
    weekly_check_in: 0,
    dynamic: 1,
  }

   enum type: {
    company: 0,
    team:1,
    personal:2
  }

  # enum time_zone: {
  #   user:0,
  #   company:1,
  # }

  # Validation
  # check for reminder should only accept one key at a time
  # check for date_time_config


  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

  scope :with_name, ->(name) { where(name: name) }
end
