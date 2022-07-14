class CheckInTemplate < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include HasCreator

  enum check_in_type: {
    weekly_check_in: 0,
    dynamic: 1,
  }

  scope :sort_by_company, ->(company) { where(company_id: [nil, company.id]) }
  scope :optimized, -> { includes([:check_in_templates_steps ]) }
  scope :not_skipped, ->  { where(skip: false) }
  scope :is_parent, ->  { where(parent: nil) }

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
 
  #run the notifications migrations the right people for global, you have done it for custom and children templates

  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

  scope :with_name, ->(name) { where(name: name) }
end
