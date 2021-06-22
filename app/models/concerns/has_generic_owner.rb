module HasGenericOwner
  extend ActiveSupport::Concern

  included do
    belongs_to :user class_name: "User", optional: true
    belongs_to :company, class_name: "Company", optional: true
    belongs_to :team, class_name: "Team", optional: true

    scope :created_by_entity, ->(owner) { where(user: owner.id).or.where(company: owner.id).or.where(team: owner.id) }
  end
end
