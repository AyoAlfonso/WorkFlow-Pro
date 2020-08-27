module HasCreator
  extend ActiveSupport::Concern
  
  included do
    belongs_to :created_by, class_name: "User"
    validates :created_by_id, presence: true

    scope :created_by, -> (user) { where(created_by: user)}
  end
end