class KeyElement < ApplicationRecord
  belongs_to :elementable, :polymorphic => true
end
