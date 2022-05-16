class Api::TeamIssuesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:update]
  respond_to :json

  def index
    @team_issues = policy_scope(TeamIssue).for_team(params[:team_id]).sort_by_position.exclude_personal_for_team
    authorize @team_issues
    render "api/team_issues/index"
  end

  def update
    @team_issue = TeamIssue.find(params[:id])
    authorize @team_issue

    if team_meeting_params[:meeting_id]
      team_meeting_params[:meeting_enabled] ?
        @team_issue.team_issue_meeting_enablements.where(meeting_id: team_meeting_params[:meeting_id]).first_or_create(meeting_id: team_meeting_params[:meeting_id]) :
        @team_issue.team_issue_meeting_enablements.find_by(meeting_id: team_meeting_params[:meeting_id])&.destroy
    end

    if @team_issue.issue.completed_at.present? && !@team_issue.completed_at.present?
      @team_issue.update!(team_issue_params.merge(completed_at: @team_issue.issue.completed_at))
      @team_issue.move_to_bottom
    else
      @team_issue.update!(team_issue_params)
    end
    if params[:meeting_id]
      @team_issues = TeamIssue.for_team(@team_issue.team_id).sort_by_position.exclude_personal_for_team
      @meeting_team_issues = Issue.for_meeting(params[:meeting_id]).exclude_personal_for_team
    else
      @team_issues = TeamIssue.for_team(@team_issue.team_id).sort_by_position
    end
    render "api/team_issues/update"
  end

  private

  def team_issue_params
    params.require(:team_issue).permit(:id, :team_id, :issue_id, :position, :completed_at)
  end

  def team_meeting_params
    params.permit(:meeting_id, :meeting_enabled)
  end

  def record_activities
     controller = "Topics" if current_company.display_format == "Forum"
      record_activity(params[:note], controller, params[:id])
  end
end
