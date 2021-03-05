class Step < ApplicationRecord
  belongs_to :meeting_template

  enum step_type: { image: 0, component: 1, embedded_link: 2, description_text: 3 }
  has_one_attached :image

  default_scope { order(meeting_template_id: :asc).order(order_index: :asc) }
  
  include RichTextHelper
  has_rich_text :description_text
  rich_text_content_render :description_text

  #override steps and meetings via override_key

  def image_url
    image.present? ? Rails.application.routes.url_helpers.rails_blob_url(image, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  MEETING_STEP_COMPONENTS = [
    "ConversationStarter",
    "TeamPulse",
    "Goals",
    "KeyActivities",
    "Issues",
    "Recap",
    "MeetingRating",
    "PersonalGoals",
    "WeeklyReflection",
    "Milestones",
    "PersonalKeyActivities",
    "DailyPlanning",
    "CompleteDailyPlanning",
    "ParkingLot",
    "ExplorationTopic",
  ]
end
