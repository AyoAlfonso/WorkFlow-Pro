module HasOwner
  extend ActiveSupport::Concern

  included do
    before_update :update_owned_by
    belongs_to :owned_by_id, class_name: "User"
  end

  def update_owned_by(user_id)
    self.owned_by_id = user_id
  end
end