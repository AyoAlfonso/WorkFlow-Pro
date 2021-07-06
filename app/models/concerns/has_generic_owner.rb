module HasGenericOwner
  extend ActiveSupport::Concern

  included do
    belongs_to :user
    belongs_to :company
    belongs_to :team

    scope :owned_by_entity, ->(owner) { where(user: owner).or(self.where(company: owner)).or(self.where(team: owner)) }
  end
end
