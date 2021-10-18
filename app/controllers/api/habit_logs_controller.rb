class Api::HabitLogsController < Api::ApplicationController
  before_action :set_habit
  respond_to :json

  # If HabitLog exists then delete it, else create one
  def update
    @new_habit_log = HabitLog.new(
      habit: @habit,
      log_date: params[:log_date],
    )
    if @habit_log.present?
      @habit_log.destroy
    else
      @new_habit_log.save!
    end

    render json: {
      habit_log: @new_habit_log,
      habit: @habit.reload,
    }.as_json
  end

  private

  def habit_params
    params.require(:habit).permit(:color, :frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = Habit.find(params[:habit_id])
    authorize @habit
    # first_or_initialize not working here I think because the deleted object might still be in memory
    @habit_log = @habit.habit_logs.where(log_date: params[:log_date]).first
    # authorize @habit
  end
end
