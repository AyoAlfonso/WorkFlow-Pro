class Api::IssuesController < Api::ApplicationController
  before_action :set_issue, only: [:update, :destroy]

  respond_to :json

  def index
    @issues = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    render "api/issues/index"
  end

  def create 
    @issue = Issue.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], team_id: params[:team_id], position: params[:position] })
    authorize @issue
    @issue.save!
    if params[:team_id]
      TeamIssue.create!(issue_id: @issue.id, team_id: params[:team_id])
      @team_issues = TeamIssue.for_team(params[:team_id]).sort_by_position
      @issues_to_render = team_meeting_issues(params[:team_id])
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    render "api/issues/create"
  end

  def update
    @issue.update(issue_params.merge(completed_at: params[:completed] ? Time.now : nil))
    TeamIssue.update({completed_at: @issue.completed_at})
    if params[:from_team_meeting] == true
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
      @issues_to_render = team_meeting_issues(team_id)
    else
      @issues_to_render = policy_scope(Issue).sort_by_position_and_priority_and_created_at_and_completed_at
    end
    @team_issues = TeamIssue.for_team(team_id).sort_by_position
    render "api/issues/destroy"
  end

  def issues_for_meeting
    team_id = Meeting.find(params[:meeting_id]).team_id
    @issues = team_meeting_issues(team_id)
    authorize @issues
    render "api/issues/issues_for_meeting"
  end

  def issues_for_team
    @issues = team_meeting_issues(params[:team_id])
    authorize @issues
    render "api/issues/issues_for_team"
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
