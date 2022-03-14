class CommentLog < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  include HasOwner

  belongs_to :key_activities, -> { where(comment_logs: { parent_type: "Issue" }) }, foreign_key: "parent_id", optional: true
  belongs_to :issues, -> { where(comment_logs: { parent_type: "KeyActivity" }) }, foreign_key: "parent_id", optional: true

  validates :note, :parent_id, :owned_by_id, :parent_type, presence: true

  scope :owned_by_user, ->(user) { where(owned_by_id: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :sort_by_created_date, -> { order(created_at: :desc) }
end
