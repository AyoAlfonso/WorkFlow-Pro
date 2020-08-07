class Api::IssuesController < Api::ApplicationController
  before_action :set_issue, only: [:update, :destroy]

  respond_to :json

  def index
    @issues = policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
    render json: @issues
  end

  def create 
    @issue = Issue.new({ description: params[:description], priority: params[:priority], user: current_user})
    authorize @issue
    @issue.save!
    render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
  end

  def update
    @issue.update(issue_params.merge(completed_at: params[:completed] ? Time.now : nil))
    render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
  end

  def destroy
    @issue.destroy!
    render json: policy_scope(Issue).sort_by_priority_and_created_at_and_completed_at
  end

  private

  def issue_params
    params.permit(:user_id, :description, :completed_at, :priority, :team_id)
  end

  def set_issue
    @issue = policy_scope(Issue).find(params[:id])
    authorize @issue
  end
end
