class Company < ApplicationRecord
  has_many :users
  has_one :core_four
  accepts_nested_attributes_for :core_four
end
