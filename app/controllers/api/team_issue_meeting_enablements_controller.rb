class Api::TeamIssueMeetingEnablementsController < Api::ApplicationController
  respond_to :json

  def index
    #TODO: maybe we just pluck the ids?  It doesnt seem like we use anything much here.
    @issues = policy_scope(Issue).for_meeting(params[:meeting_id])
    authorize @issues

    render "api/team_issue_meeting_enablements/index"
  end

end
