class Milestone < ApplicationRecord
  enum progress: [:red, :yellow, :green]
end
