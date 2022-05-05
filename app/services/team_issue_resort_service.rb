class TeamIssueResortService < ApplicationService
  attr_accessor :team_issues, :meeting

  def initialize(team_issues, meeting, sort_type)
    @team_issues = team_issues
    @meeting = meeting
    @sort_type = sort_type
  end

  def call
    #reposition items that are part of meeting as the first ones, then sort the rest by priority
    sorted_meeting_team_issues = @team_issues.where(id: meeting.team_issue_meeting_enablements.pluck(:id)).sort_by_position.sort_by_completed_date
    sorted_team_issues = @team_issues.where.not(id: meeting.team_issue_meeting_enablements.pluck(:id)).sort_by_issue_priority.sort_by_completed_date
  #  binding.pry
 
    reset_positions(sorted_meeting_team_issues, sorted_team_issues)
    if @sort_type == 'by_upvotes'
      sorted_team_issues = sorted_team_issues.sort_by_issue_upvotes
    end
  end

  def reset_positions(sorted_meeting_team_issues, sorted_team_issues)
    sorted_issues_last_index = sorted_meeting_team_issues.count
    updated_meeting_issues = sorted_meeting_team_issues.each_with_index.map do |team_issue, index|
      team_issue.position = index + 1
      team_issue.as_json
    end
    updated_team_issues = sorted_team_issues.each_with_index.map do |team_issue, index|
      team_issue.position = index + 1 + sorted_issues_last_index
      team_issue.as_json
    end
    # team_issues.complete.each_with_index do |team_issue, index|
    #   team_issue.position = index + 1
    # end
    TeamIssue.upsert_all(updated_meeting_issues + updated_team_issues)
    team_issues
  end
end
