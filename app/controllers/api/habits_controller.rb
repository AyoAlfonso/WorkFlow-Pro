class Api::HabitsController < Api::ApplicationController
  before_action :set_habit, except: [:create, :index]

  respond_to :json

  def index
    @habits = Habit.all
    render json: @habits
  end

  def create
    @key_activity = KeyActivity.new({ user: current_user, description: params[:description], priority: params[:priority], complete: false, weekly_list: false })
    authorize @key_activity
    @key_activity.save!
    render json: KeyActivity.sort_by_priority_and_created_at_date
  end

  def update
    @key_activity.update(key_activity_params.merge(completed_at: params[:completed] ? Time.now : nil))
    render json: KeyActivity.sort_by_priority_and_created_at_date
  end

  def destroy
    @key_activity.destroy!
    render json: { key_activity_id: @key_activity.id, status: :ok }
  end

  private

  def key_activity_params
    params.require(:habit).permit(:frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = policy_scope(Habit)
    authorize @habit
  end
end
