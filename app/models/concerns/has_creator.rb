module HasCreator
  extend ActiveSupport::Concern
  
  included do
    belongs_to :created_by, class_name: "User"
    validates :created_by_id, presence: true
  end
end