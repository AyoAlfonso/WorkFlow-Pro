class TeamIssueMeetingEnablementsService < ApplicationService
  attr_accessor :issue, :params

  def initialize(issue, params)
    @issue = issue
    @params = params
  end

  def call
    @team_issue_meeting_enablement = TeamIssueMeetingEnablement.where(meeting_id: params[:meeting_id], team_issue_id: @issue.team_issue.id).first_or_create(meeting_id: params[:meeting_id], team_issue_id: @issue.team_issue.id)
  end

end
