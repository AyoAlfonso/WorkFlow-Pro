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

  def show
    render json: @habit
  end

  def update
    @habit.update!(habit_params)
    render json: @habit
  end

  def destroy
    @habit.destroy!
    render json: { habit_id: @habit.id, status: :ok}
  end

  private

  def habit_params
    params.require(:habit).permit(:color, :frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = policy_scope(Habit).find(params[:id])
    authorize @habit
  end
end
