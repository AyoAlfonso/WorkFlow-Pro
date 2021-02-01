class Api::IssuesController < Api::ApplicationController
  before_action :set_issue, only: [:update, :destroy]

  respond_to :json

  def index
    @issues = policy_scope(Issue).where(user_id: current_user.id).sort_by_position_and_priority_and_created_at_and_completed_at
    render "api/issues/index"
  end

  def create 
    @issue = Issue.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], team_id: params[:team_id], position: params[:position], company_id: current_company.id })
    authorize @issue
    @issue.insert_at(1)
    @issue.save!

    if params[:team_id]
      # USE HOOK TO CREATE A TEAM ISSUE IF IT DOESNT EXIST FOR @ISSUE
      @team_issues = TeamIssue.for_team(params[:team_id]).sort_by_position
      @issues_to_render = team_meeting_issues(params[:team_id])
      if params[:meeting_id]
        @forum_meeting_team_issues = TeamIssueMeetingEnablementsService.call(@issue, params)
      end
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    
    render "api/issues/create"
  end

  def update
    @issue.update!(issue_params.merge(completed_at: params[:completed] ? Time.now : nil))
    if params[:from_team_meeting]
      @issues_to_render = team_meeting_issues(@issue.team_id)
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    @team_issues = TeamIssue.for_team(@issue.team_id).sort_by_position
    render "api/issues/update"
  end

  def destroy
    team_id = @issue.team_id
    @issue.destroy!
    if params[:from_team_meeting] == "true"
      #TODO: ensure enablements destroyed here as well
      @issues_to_render = team_meeting_issues(@issue.team_id)
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    @team_issues = TeamIssue.for_team(team_id).sort_by_position
    render "api/issues/destroy"
  end

  def issues_for_meeting
    team_id = Meeting.find(params[:meeting_id]).team_id
    @issues = team_meeting_issues(team_id)
    @team_issues = TeamIssue.for_team(team_id).sort_by_position
    authorize @issues
    render "api/issues/issues_for_meeting"
  end

  def issues_for_team
    @issues = team_meeting_issues(params[:team_id])
    @team_issues = TeamIssue.for_team(params[:team_id]).sort_by_position
    authorize @issues
    render "api/issues/issues_for_team"
  end

  def resort_index
    if params[:meeting_id].present?
      team_id = Meeting.find(params[:meeting_id]).team_id
      @issues = team_meeting_issues(team_id)
      @team_issues = TeamIssueResortService.call(TeamIssue.for_team(team_id))
    elsif params[:team_id].present? && params[:meeting_id].blank?
      @issues = IssueResortService.call(policy_scope(Issue).where(team_id: params[:team_id]))
    else
      @issues = IssueResortService.call(policy_scope(Issue).where(user_id: current_user.id))
    end
    authorize @issues
    render "api/issues/resort"
  end

  private

  def issue_params
    params.permit(:user_id, :description, :completed_at, :priority, :team_id, :position)
  end

  def set_issue
    @issue = policy_scope(Issue).find(params[:id])
    authorize @issue
  end

  def team_meeting_issues(team_id)
    policy_scope(Issue).where(team_id: team_id).sort_by_position_and_priority_and_created_at_and_completed_at
  end
end
