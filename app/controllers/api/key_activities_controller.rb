class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :destroy]

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position_priority_and_created_at
    render json: @key_activities
  end

  def create
    @key_activity = KeyActivity.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], complete: false, weekly_list: params[:weekly_list] })
    authorize @key_activity
    @key_activity.save!
    render json: KeyActivity.owned_by_user(current_user).sort_by_position_priority_and_created_at
  end

  def update
    @key_activity.update!(key_activity_params.merge(completed_at: params[:completed] ? Time.now : nil))
    render json: KeyActivity.owned_by_user(current_user).sort_by_position_priority_and_created_at
  end

  def destroy
    @key_activity.destroy!
    render json: KeyActivity.owned_by_user(current_user).sort_by_position_priority_and_created_at
  end

  def created_in_meeting
    @key_activities = policy_scope(KeyActivity).created_in_meeting(params[:meeting_id])
    authorize @key_activities
    render json: @key_activities
  end

  private

  def key_activity_params
    params.permit(:id, :user_id, :description, :completed_at, :priority, :complete,
      :weekly_list, :todays_priority, :position)
  end

  def set_key_activity
    @key_activity = policy_scope(KeyActivity).find(params[:id])
    authorize @key_activity
  end
end
