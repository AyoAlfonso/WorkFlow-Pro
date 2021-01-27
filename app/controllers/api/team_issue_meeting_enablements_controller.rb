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
    @issues = policy_scope(Issue
                            .joins(:team_issue)
                            .joins(:team_issue_meeting_enablements)
                            .where(team_issue_meeting_enablements: {meeting_id: params[:meeting_id]}))
    authorize @issues

    render "api/team_issue_meeting_enablements/index"
  end

  private
  def team_issue_meeting_enablement_params
    params.require(:team_issue_meeting_enablement).permit(:meeting_id, :team_issue_id)
  end
end
