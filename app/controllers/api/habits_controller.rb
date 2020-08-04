class Api::HabitsController < Api::ApplicationController
  before_action :set_habit, except: [:create, :index]

  respond_to :json

  def index
    @habits = policy_scope(Habit)
    render json: @habits
  end

  def create
    @habit = Habit.
              select(:id, :frequency, :name, :color, :user_id).
                new(
                  user: current_user,
                  name: habit_params[:name],
                  frequency: habit_params[:frequency],
                  color: habit_params[:color]
                )
    authorize @habit

    @habit.save!
    render json: @habit
  end

  # def update
  #   @key_activity.update(key_activity_params.merge(completed_at: params[:completed] ? Time.now : nil))
  #   render json: KeyActivity.sort_by_priority_and_created_at_date
  # end

  # def destroy
  #   @key_activity.destroy!
  #   render json: { key_activity_id: @key_activity.id, status: :ok }
  # end

  private

  def habit_params
    params.require(:habit).permit(:color, :frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = policy_scope(Habit)
    authorize @habit
  end
end
