module HasCreator
  extend ActiveSupport::Concern
  
  included do
    before_create :assign_created_by
    belongs_to :created_by_id, class_name: "User"
  end

  def assign_created_by(user_id)
    self.created_by_id = user_id
  end
end