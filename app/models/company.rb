class Company < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include ActionView::Helpers::SanitizeHelper
  include HasTimezone
  include HasFiscalYear

  before_save :sanitize_rallying_cry
  store_accessor :preferences, :foundational_four, :company_objectives, :personal_objectives
  enum display_format: { Company: 0, Forum: 1 }
  enum objectives_key_type: { Milestones: 0, KeyResults: 1 }
  enum forum_type: { EO: 0, YPO: 1, Organisation: 2, Other: 3 }
  # has_many :users, dependent: :restrict_with_error #thi shas been replaced with default company
  has_many :annual_initiatives, dependent: :destroy
  has_many :teams, dependent: :destroy

  has_many :company_static_datas, dependent: :destroy
  has_many :description_templates, dependent: :destroy
  has_one_attached :logo, dependent: :destroy
  has_one :sign_up_purpose, dependent: :destroy
  accepts_nested_attributes_for :sign_up_purpose, :allow_destroy => true

  has_one :core_four, dependent: :destroy
  accepts_nested_attributes_for :core_four

  has_many :user_company_enablements, dependent: :destroy
  has_many :users, through: :user_company_enablements

  accepts_nested_attributes_for :description_templates, :allow_destroy => true
  accepts_nested_attributes_for :company_static_datas, :allow_destroy => true
  accepts_nested_attributes_for :user_company_enablements, :allow_destroy => true

  validates :name, :timezone, :display_format, presence: true
  validate :display_format_not_changed, on: :update
  validate :forum_type_not_changed, on: :update

  enum onboarding_status: { incomplete: 0, complete: 1 }

  after_create :create_company_static_data, :create_default_description_templates, :create_default_preferences

  scope :with_team, ->(team_id) { joins(:teams).where({ teams: { id: team_id } }) }

  after_save :verify_company_static_data, :verify_description_templates

  def verify_company_static_data
    company_static_datas.create(field: "annual_objective", value: "Annual Objective") if company_static_datas.where(field: "annual_objective").blank?
    company_static_datas.create(field: "quarterly_initiative", value: "Quarterly Initiative") if company_static_datas.where(field: "quarterly_initiative").blank?
    company_static_datas.create(field: "sub_initiative", value: "Supporting Initiative") if company_static_datas.where(field: "sub_initiative").blank?
  end

  def verify_description_templates
    existing_templates = description_templates.where(template_type: DefaultAdminTemplate.template_types.values.map(&:to_i)).pluck(:template_type)
    if existing_templates.length < DefaultAdminTemplate.template_types.length
      DefaultAdminTemplate.find_each do |template|
        if !template.template_type.in?(existing_templates)
          DescriptionTemplate.create!(template_type: template.template_type, company: self, body: template.body, title: template.title)
        end
      end
    end
  end

  def self.find_first_with_team(team_id)
    with_team(team_id).first
  end

  def core_four
    super || build_core_four
  end

  def logo_url
    logo.present? ? Rails.application.routes.url_helpers.rails_blob_url(logo, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  def accountability_chart_content
    accountability_chart_embed
  end

  def strategic_plan_content
    strategic_plan_embed
  end

  def date_for_start_on(fiscal_year)
    result = self.current_fiscal_start_date
    if fiscal_year.to_i != self.year_for_creating_annual_initiatives
      result = result + (fiscal_year.to_i - self.year_for_creating_annual_initiatives).year
    end
    result
  end

  def forum_intro_video
    StaticData.find_by_field("forum_introduction")
  end

  def forum_types
    Company.forum_types
  end

  def objectives_key_types
    Company.objectives_key_types
  end

  private

  def sanitize_rallying_cry
    self.rallying_cry = strip_tags(rallying_cry)
  end

  def within_4_weeks_range(end_date)
    self.convert_to_their_timezone + 4.weeks >= end_date
  end

  def display_format_not_changed
    if display_format_changed? && self.persisted?
      errors.add(:display_format, "Update of display_format not allowed.  Please create a new company.")
    end
  end

  def forum_type_not_changed
    if forum_type_changed? && self.display_format == "Company" && self.persisted?
      errors.add(:forum_type, "Update of forum type not allowed for a company. Please create a new forum.")
    end
  end

  def create_company_static_data
    CompanyStaticData.create!(field: "annual_objective", value: "Annual Objective", company: self)
    CompanyStaticData.create!(field: "quarterly_initiative", value: "Quarterly Initiative", company: self)
    CompanyStaticData.create!(field: "sub_initiative", value: "Supporting Initiative", company: self)
  end

  def create_default_description_templates
    DefaultAdminTemplate.find_each do |template|
      DescriptionTemplate.create!(template_type: template.template_type, company_id: self.id, body: template.body, title: template.title)
    end
  end
  def create_default_preferences
    if self.display_format == "Company"
        self.preferences = {:foundational_four => true,:company_objectives => true, :personal_objectives => true}
    end
    if self.display_format == "Forum" &&
        if self.forum_type == "Organisation"
          self.preferences = {:foundational_four => false,:company_objectives => true, :personal_objectives => true}
        else
          self.preferences = {:foundational_four => true,:company_objectives => true, :personal_objectives => true}
        end
    end
    self.save
  end
end
