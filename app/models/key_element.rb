class KeyElement < ApplicationRecord
  belongs_to :elementable, :polymorphic => true

  default_scope { order(id: :asc) }

end
