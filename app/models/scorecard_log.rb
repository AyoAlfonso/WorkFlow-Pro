class ScoreCardLog < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  include HasGenericOwn
  before_save :sanitize_description
  after_save :purge_old_scorecard

  validates :description, :target_value, :created_by, :unit_type, presence: true
  enum unit_type: { percentage: "percentage", numerical: "numerical", currency: "currency" }
  scope :created_by_user, ->(user) { where(user: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :user_log_created_between, ->(owner, key_performance_indicator_id, current_week_start, current_week_end) { where(key_performance_indicator_id: key_performance_indicator_id).created_by_entity(owner).created_between(date_start, date_end) }
  scope :thirteen_weeks_of_scorecards, ->(kpi_id, fiscal_year, fiscal_quarter) { where(key_performance_indicator_id: kpi_id, fiscal_quarter: fiscal_quarter, fiscal_year: fiscal_year).group(:week) }
  # scope: owner
  #save the data for kpi and create api route

  def purge_old_scorecard
    current_user = self.user_id
    kpi_id = self.key_performance_indicator_id
    current_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    current_week_end = current_user.time_in_user_timezone
    owner = current_user || self.team_id || self.company_id

    while self.user_log_created_between(owner, kpi_id, current_week_start, current_week_end).count > 10
      self.first.destroy
    end
  end

  def def(logger)
    #Getting model by logger
  end

  #protect route
  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
