module HasGenericOwner
  extend ActiveSupport::Concern

  included do
    belongs_to :user, optional: true
    belongs_to :company, optional: true
    belongs_to :team, optional: true

    scope :owned_by_entity, ->(owner) { where(user: owner).or(self.where(company: owner)).or(self.where(team: owner)) }
  end
end
