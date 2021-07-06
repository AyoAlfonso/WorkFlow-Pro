module HasGenericOwner
  extend ActiveSupport::Concern

  included do
    belongs_to :user
    belongs_to :company, class_name: "Company", optional: true
    belongs_to :team, class_name: "Team", optional: true

    scope :created_by_entity, ->(owner) { where(user: owner).or.where(company: owner).or.where(team: owner) }
  end
end
