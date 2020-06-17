class Comment < ApplicationRecord
  include HasCreator

  belongs_to :annual_initiative, polymorphic: true
end
