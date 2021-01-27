class TeamIssueMeetingEnablementsService < ApplicationService
  attr_accessor :issue, :params

  def initialize(issue, params)
    @issue = issue
    @params = params
  end

  def call

    @team_issue_meeting_enablement = TeamIssueMeetingEnablement.new(meeting_id: params[:meeting_id], team_issue_id: @issue.team_issue.id)
    @team_issue_meeting_enablement.save!

    @issues = Issue
      .joins(:team_issue)
      .joins(:team_issue_meeting_enablements)
      .where(team_issue_meeting_enablements: {meeting_id: params[:meeting_id]})
  end

end
