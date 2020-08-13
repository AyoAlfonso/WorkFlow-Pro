class Step < ApplicationRecord
  belongs_to :meeting_template

  enum step_type: { image: 0, component: 1 }
  has_one_attached :image

  def image_url
    image.present? ? Rails.application.routes.url_helpers.rails_blob_url(image, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end
end
