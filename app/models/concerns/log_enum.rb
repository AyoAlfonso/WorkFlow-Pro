module LogEnum
  extend ActiveSupport::Concern

  included do
    enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3, done: 4 }
  end
end
