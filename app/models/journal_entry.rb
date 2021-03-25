class JournalEntry < ApplicationRecord
  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::SanitizeHelper
  belongs_to :generated_from, optional: true
  belongs_to :user

  scope :for_user, -> (user) { where(user: user) }
  scope :between, -> (start_date, end_date) {where(created_at: start_date..end_date)}
  scope :sort_by_created_at, -> { order(created_at: :desc) }

  before_save :update_preview

  def update_preview
    self.preview = truncate(strip_tags(self.body), length: 100, omission: '...')
  end
end
