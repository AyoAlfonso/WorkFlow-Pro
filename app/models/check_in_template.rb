class CheckInTemplate < ApplicationRecord
  acts_as_paranoid column: :deleted_at 

  enum check_in_type: {
    weekly_check_in: 0,
    dynamic: 1,
  }
  enum status: {
    draft: 0,
    published:1,
    archived: 2,
  }
  enum owner_type: {
    company: 0,
    team:1,
    personal:2
  }

  validates :check_in_type, presence: true
  scope :sort_by_company, ->(company) { where(company_id: [nil, company.id]) }
  scope :sort_by_global_only, ->  { where(tag: ['global']) }
  scope :sort_by_custom_only, ->  { where(tag: ['custom']) }
  scope :optimized, -> { includes([:check_in_templates_steps ]) }
  scope :not_skipped, ->  { where(skip: false) }
  scope :is_parent, ->  { where(parent: nil) }
  scope :created_by_user, ->(user) { where(created_by: [user, nil]) }
  scope :with_name, ->(name) { where(name: name) }

  has_many :check_in_templates_steps, dependent: :destroy
  has_many :check_in_artifacts, dependent: :destroy
  belongs_to :created_by, class_name: "User"

  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

  def as_json(options = [])
    super({
       include: [
        check_in_templates_steps: { methods: ["step_type", "order_index", "name", "instructions", "duration","component_to_render","check_in_template_id", "variant", "question" ] },
         check_in_artifacts: {
          except: [:created_at, :updated_at]
           }
         ],
        })
        .merge({:period => self.period})
  end

   def period
     (self.check_in_artifacts.empty?) ? {} : self.check_in_artifacts.group_by { |log| log[:start_time].strftime("%A, %B, %d, %Y")}.map do |start_time, check_in_artifact|
        [start_time, check_in_artifact]
       end.to_h
   end

  def related_parent
    if !self.parent.present?
      return nil
    elsif self.parent.present?
      return CheckInTemplate.find(id: self.parent)
    end
  end
  #run the notifications migrations the right people for global, you have done it for custom and children templates

  accepts_nested_attributes_for :check_in_templates_steps, allow_destroy: true

end
