module HasViewer
  extend ActiveSupport::Concern

  included do
    scope :vieweable_by_entity, ->(owner_type, owner_id) { where("viewers @> ?", %Q([{ "type": "#{owner_type}", "id": "#{owner_id}"}]))  }
    scope :vieweable_by_entity_and_owner_id, ->(owner_type, owner_id) { where("viewers @> ? OR owned_by_id= ?", %Q([{ "type": "#{owner_type}", "id": "#{owner_id}"}]), owner_id)  }
  end
end
