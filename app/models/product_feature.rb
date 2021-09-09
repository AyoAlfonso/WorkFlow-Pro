class ProductFeature < ApplicationRecord
  belongs_to :user
  # validates :scorecard, :pyns, presence: true, on: :update
end
