class Api::TeamIssueMeetingEnablementsController < Api::ApplicationController
  respond_to :json

  def index
    @issues = policy_scope(Issue
                            .joins(:team_issue)
                            .joins(:team_issue_meeting_enablements)
                            .where(team_issue_meeting_enablements: {meeting_id: params[:meeting_id]}))
    authorize @issues

    render "api/team_issue_meeting_enablements/index"
  end

end
