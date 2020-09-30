class Api::TeamIssuesController < Api::ApplicationController
  respond_to :json

  def index
    @team_issues = policy_scope(TeamIssue).for_team(params[:team_id]).sort_by_position
    authorize @team_issues
    render "api/team_issues/index"
  end

  def update
    @team_issue = TeamIssue.find(params[:id])
    if @team_issue.issue.completed_at.present? && !@team_issue.completed_at.present?
      @team_issue.update!(team_issue_params.merge(completed_at: @team_issue.issue.completed_at))
      @team_issue.move_to_bottom
    else
      @team_issue.update!(team_issue_params)
    end
    authorize @team_issue
    @team_issues = TeamIssue.for_team(@team_issue.team_id).sort_by_position
    render "api/team_issues/update"
  end

  private

  def team_issue_params
    params.require(:team_issue).permit(:id, :team_id, :issue_id, :position, :cpmpleted_at)
  end

end
