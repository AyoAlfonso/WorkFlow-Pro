class Company < ApplicationRecord
  has_many :users
  has_one :core_four
end
