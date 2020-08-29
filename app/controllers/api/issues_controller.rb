class Api::IssuesController < Api::ApplicationController
  before_action :set_issue, only: [:update, :destroy]

  respond_to :json

  def index
    @issues = policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
    render json: @issues
  end

  def create 
    @issue = Issue.new({ description: params[:description], priority: params[:priority], user: current_user, team_id: params[:team_id] })
    authorize @issue
    @issue.save!
    if params[:team_id]
      render json: team_meeting_issues(params[:team_id])
    else
      render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
    end
  end

  def update
    @issue.update(issue_params.merge(completed_at: params[:completed] ? Time.now : nil))
    if params[:from_team_meeting]
      render json: team_meeting_issues(@issue.team_id)
    else
      render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
    end
  end

  def destroy
    team_id = @issue.team_id
    @issue.destroy!
    if params[:from_team_meeting]
      render json: team_meeting_issues(team_id)
    else
      render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
    end
  end

  def issues_for_meeting
    team_id = Meeting.find(params[:meeting_id]).team_id
    @issues = team_meeting_issues(team_id)
    authorize @issues
    render json: @issues
  end

  private

  def issue_params
    params.permit(:user_id, :description, :completed_at, :priority, :team_id)
  end

  def set_issue
    @issue = policy_scope(Issue).find(params[:id])
    authorize @issue
  end

  def team_meeting_issues(team_id)
    policy_scope(Issue).where(team_id: team_id).sort_by_priority_and_created_at_and_completed_at
  end
end
