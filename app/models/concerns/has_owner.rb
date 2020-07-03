module HasOwner
  extend ActiveSupport::Concern

  included do
    belongs_to :owned_by, class_name: "User"
    validates :owned_by_id, presence: true
  end
end