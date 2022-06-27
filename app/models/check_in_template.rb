class CheckInTemplate < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include HasOwner

  enum check_in_type: {
    weekly_check_in: 0,
    dynamic: 1,
  }

  scope :sort_by_company, ->(company) { where(company_id: [nil, company.id]) }
  scope :optimized, -> { includes([:check_in_templates_steps ]) }

  has_many :check_in_templates_steps, dependent: :destroy

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
