class ScorecardLog < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  # before_save :sanitize_notes
  # after_save :purge_old_scorecard
  belongs_to :user
  belongs_to :key_performance_indicator
  validates :score, :week, :fiscal_quarter, :fiscal_year, :key_performance_indicator_id, :user_id, presence: true

  scope :created_by_user, ->(user) { where(user: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :user_log_created_between, ->(owner, kpi_id, current_week_start, current_week_end) { where(key_performance_indicator_id: kpi_id).created_between(current_week_start, current_week_end) }
  scope :thirteen_weeks_of_scorecards, ->(kpi_id, fiscal_year, fiscal_quarter) {
          where(key_performance_indicator_id: kpi_id, fiscal_quarter: fiscal_quarter, fiscal_year: fiscal_year)
        }

  def self.scorecard_logs(kpi_id)
    ScorecardLog.where.(key_performance_indicator_id: kpi_id).group_by(&:week)
  end

  def purge_old_scorecard
    time_in_user_timezone = self.user.time_in_user_timezone
    kpi_id = self.key_performance_indicator_id
    current_week_start = get_beginning_of_last_or_current_work_week_date(time_in_user_timezone)

    current_week_end = self.user.time_in_user_timezone
    owner = self.user.id

    if self.user_log_created_between(owner, kpi_id, current_week_start, current_week_end).count > 10
      self.first.destroy
    end
  end

  def as_json(options = [])
    super({
        include: [:user_data, :key_performance_indicator]
    })
  end

  def def(logger)
    #Getting model by logger
  end

  def kpi_data
    self.key_performance_indicator
  end

  def user_data
    self.user
  end

  #protect route
  # private

  # def sanitize_notes
  # sanitize notes
  #   self.notes = strip_tags(notes)
  # end
end
