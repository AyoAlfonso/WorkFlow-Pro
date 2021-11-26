class KeyElement < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_value
  has_many :objective_logs, as: :objecteable
  belongs_to :elementable, :polymorphic => true
  belongs_to :user, optional: true

  # completion_type of binary is boolean, if completed_at.present?
  # completion_type of currency is in cents (data type integer)
  enum completion_type: { binary: 0, numerical: 1, percentage: 2, currency: 3 }
  enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3 }

  default_scope { order(id: :asc) }

  def as_json(options = [])
    super({include: {
                  objective_logs: { methods: [:owned_by] }}
    }).merge({ :period => self.period, })
  end

  def period
     (self.objective_logs.empty?) ? {} : self.objective_logs.group_by { |log| log[:fiscal_year] }.map do |year, objective_log|
        [year, objective_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
        end.to_h
  end

  private

  def sanitize_value
    self.value = strip_tags(value)
    self.completion_current_value = strip_tags(completion_current_value.to_s).to_i
    self.completion_target_value = strip_tags(completion_target_value.to_s).to_i
  end
end
