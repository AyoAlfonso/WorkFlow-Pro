module HasGenericOwner
  extend ActiveSupport::Concern

  included do

    scope :owned_by_entity, ->(owner) { where("owner ->> 'id' = ?", owner)}
  end
end
