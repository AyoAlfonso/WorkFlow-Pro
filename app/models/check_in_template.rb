class CheckInTemplate < ApplicationRecord
  has_many :check_in_templates_steps, dependent: :destroy

  enum check_in_type: {
    weekly_check_in: 0,
    dynamic: 1,
  }

  scope :sort_by_company, ->(company) { where(company_id: [nil, company.id]) }
  scope :optimized, -> { includes([:check_in_templates_steps ]) }
  scope :incomplete, -> { where(end_time: nil) }
  scope :for_day_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_day, start_time.end_of_day) }
  scope :for_week_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_week, start_time.end_of_week) }
  scope :for_month_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_month, start_time.end_of_month) }
  scope :for_week_of_date_started_only, ->(start_time) { where("(start_time >= ? AND start_time <= ?)", start_time.beginning_of_week, start_time.end_of_week) }
  
  enum owner_type: {
    company: 0,
    team:1,
    personal:2
  }


  def as_json(options = [])
    super({
       include: {check_in_templates_steps: { methods: ["step_type", "order_index", "name", "instructions", "duration","component_to_render","check_in_template_id", "variant", "question" ] }
        }})
  end

  # enum time_zone: {
  #   user: 0,
  #   company: 1,
  # }

  # Validation
  # check for reminder should only accept one key at a time
  # check for date_time_config


  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

  scope :with_name, ->(name) { where(name: name) }
end
