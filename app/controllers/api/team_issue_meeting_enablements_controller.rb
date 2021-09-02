class Api::TeamIssueMeetingEnablementsController < Api::ApplicationController
  respond_to :json

  def index
    #TODO: maybe we just pluck the ids?  It doesnt seem like we use anything much here.
    meeting = Meeting.find(params[:meeting_id])
    @issues = policy_scope(Issue).for_meeting(params[:meeting_id]).exclude_personal_for_team
    authorize @issues

    render "api/team_issue_meeting_enablements/index"
  end
end
