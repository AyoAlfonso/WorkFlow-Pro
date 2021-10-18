class Api::HabitsController < Api::ApplicationController
  include StatsHelper
  before_action :set_habit, except: [:create, :index, :habits_for_personal_planning]

  respond_to :json

  def index
    @habits = policy_scope(Habit)
    render json: { habits: @habits, last_five_days: last_five_days }
  end

  def create
    @habit = Habit.
      select(:id, :frequency, :name, :color, :user_id).
      new(
      user: current_user,
      name: habit_params[:name],
      frequency: habit_params[:frequency],
      color: habit_params[:color],
    )
    authorize @habit

    @habit.save!
    render json: @habit
  end

  def show_habit
    render "api/habits/show_habit"
  end

  def update
    @habit.update!(habit_params)
    render json: @habit
  end

  def destroy
    @habit.destroy!
    render json: { habit_id: @habit.id, status: :ok }
  end

  def habits_for_personal_planning
    @habits = policy_scope(Habit)
    authorize @habits
    @current_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    @current_week_end = current_user.time_in_user_timezone
    render "api/habits/habits_for_personal_planning"
  end

  private

  def habit_params
    params.require(:habit).permit(:color, :frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = policy_scope(Habit).find(params[:id])
    authorize @habit
  end

  def last_five_days
    (0..4).map do |index|
      (current_user.convert_to_their_timezone - index.days).to_date
    end
  end
end
