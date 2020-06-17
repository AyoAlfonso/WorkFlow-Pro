class PersonalReflection < ApplicationRecord
  belongs_to :user

  has_many :create_my_days
  has_many :thought_challenges
  has_many :evening_reflections
end
