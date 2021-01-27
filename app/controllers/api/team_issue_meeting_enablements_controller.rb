class Api::TeamIssueMeetingEnablementsController < Api::ApplicationController
  respond_to :json

  def create
    @team_issue_meeting_enablement = TeamIssueMeetingEnablement.new(team_issue_meeting_enablement_params)
    authorize @team_issue_meeting_enablement
    @team_issue_meeting_enablement.insert_at(1)
    @team_issue_meeting_enablement.save!

    render "api/team_issue_meeting_enablements/create"
  end

  def index
    @team_issue_meeting_enablements = policy_scope(TeamIssueMeetingEnablement).for_team(params[:team_id])
    authorize @team_issue_meeting_enablements
    render "api/team_issue_meeting_enablements/index"
  end

  private
  def team_issue_meeting_enablement_params
    params.require(:team_issue_meeting_enablement).permit(:meeting_id, :team_issue_id)
  end
end
