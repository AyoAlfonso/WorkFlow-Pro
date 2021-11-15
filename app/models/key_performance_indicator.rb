class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasOwner
  include HasViewer

  # before_save :sanitize_description
  enum unit_type: { percentage: 0, numerical: 1, currency: 2 }
  enum parent_type: { existing: 0, rollup: 1, avr: 2}

  # TODO: Impleted soft delete with repect to the relation
  # default_scope { where(published: true) }

  scope :sort_by_company, ->(company) { where(company_id: company.id) }


  validates :title, :created_by, :viewers, :unit_type, :target_value, presence: true
  validates :greater_than, inclusion: [true, false]
  has_many :scorecard_logs, -> { order('created_at ASC') }
  
  def self.for_user(user)
    self.select { |kpi| kpi.users.include?(user) }
  end

  def as_json(options = [])
    super({
      methods: [:owned_by],
                  include: {
                  scorecard_logs: { methods: [:user] }}
    }).merge({ :parent_type => self.parent_type, :period => self.period, :related_parent_kpis => self.related_parent_kpis })
  end

  def period
     (self.scorecard_logs.empty?) ? {} : self.scorecard_logs.group_by { |log| log[:fiscal_year] }.map do |year, scorecard_log|
        [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
        end.to_h
  end
  
  def related_parent_kpis
    if !self.parent_type.present?
      return []
    elsif self.parent_type.present?
      return KeyPerformanceIndicator.where(id: self.parent_kpi).as_json()
    end
  end

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
