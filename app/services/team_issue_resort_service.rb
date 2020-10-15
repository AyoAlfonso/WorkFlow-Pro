class TeamIssueResortService < ApplicationService
  attr_accessor :team_issues

  def initialize(team_issues)
    @team_issues = team_issues
  end

  def call
    sorted_team_issues = @team_issues.sort_by_issue_priority
    reset_positions(sorted_team_issues)
  end

  def reset_positions(team_issues)
    team_issues.incomplete.each_with_index do |team_issue, index|
      team_issue.position = index + 1
      team_issue.save!
    end
    team_issues.complete.each_with_index do |team_issue, index|
      team_issue.position = index + 1
      team_issue.save!
    end
    team_issues
  end
end
