class Api::TeamIssuesController < Api::ApplicationController
  respond_to :json

  def index
    @team_issues = policy_scope(TeamIssue).for_team(params[:team_id]).sort_by_position
    authorize @team_issues
    render "api/team_issues/index"
  end

  def update
    @team_issue = TeamIssue.find(params[:id])
    authorize @team_issue
    @team_issue.insert_at(params[:position])
    @team_issue.save!
    @team_issues = TeamIssue.for_team(@team_issue.team_id).sort_by_position
    render "api/team_issues/update"
  end

end
