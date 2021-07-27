module HasViewer
  extend ActiveSupport::Concern

  included do
       scope :vieweable_by_entity, ->(viewer_type, viewer_id) { where("viewers @> ?", %Q([{ "type": "#{viewer_type}"}])).where("viewers #> '{data,0}' ->> 'id' = ?", viewer_id)}
  end
end
