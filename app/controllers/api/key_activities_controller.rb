class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :update_status, :destroy]

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).sort_by_priority_and_created_at_date
    render json: @key_activities
  end

  def create
    @key_activity = KeyActivity.new({ user: current_user, description: params[:description], priority: params[:priority], complete: false, weekly_list: false })
    authorize @key_activity
    @key_activity.save!
    render json: KeyActivity.sort_by_priority_and_created_at_date
  end

  def update
    @key_activity.update(key_activity_params)
    render json: KeyActivity.sort_by_priority_and_created_at_date
  end

  def update_status
    completed_at_value = params[:completed] ? Time.now : nil
    @key_activity.update(completed_at: completed_at_value)
    render json: KeyActivity.sort_by_priority_and_created_at_date
  end

  def destroy
    @key_activity.destroy!
    render json: { key_activity_id: @key_activity.id, status: :ok }
  end

  private 

  def key_activity_params
    params.permit(:id, :user_id, :description, :completed_at, :priority, :complete, :weekly_list)
  end
  
  def set_key_activity
    @key_activity = policy_scope(KeyActivity).find(params[:id])
    authorize @key_activity
  end
end
