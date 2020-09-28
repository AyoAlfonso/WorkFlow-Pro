class TeamIssue < ApplicationRecord
  belongs_to :team
  belongs_to :issue

  acts_as_list scope: :team_id
end
