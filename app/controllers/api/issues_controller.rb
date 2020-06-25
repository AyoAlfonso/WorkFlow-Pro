class Api::IssuesController < Api::ApplicationController
  before_action :set_issue, only: [:update, :destroy]

  respond_to :json

  def index
    @issues = policy_scope(Issue)
    render json: @issues
  end

  def create 
    @issue = Issue.create!(issue_params)
    render json: Issue.sort_by_priority_and_created_at_and_completed_at
  end

  def update
    @issue.update(issue_params)
    render json: Issue.sort_by_priority_and_created_at_and_completed_at
  end

  def destroy
    @issue.destroy!
    render json: { issue_id: @issue.id, status: :ok }
  end

  private

  def issue_params
    params.permit(:user_id, :description, :completed_at, :priority)
  end

  def set_issue
    @issue = policy_scope(Issue).find(params[:id])
  end
end
