class Api::HabitLogsController < Api::ApplicationController
  before_action :set_habit
  respond_to :json

  # If HabitLog exists then delete it, else create one
  def update
    new_habit_log = HabitLog.new(
      habit: @habit,
      log_date: params[:log_date]
    )
    if @habit_log.id.present?
      @habit_log.destroy
    else
      new_habit_log.save
    end
    render json: new_habit_log
  end

  private

  def habit_params
    params.require(:habit).permit(:color, :frequency, :id, :name, :user_id)
  end

  def set_habit
    @habit = Habit.find(params[:habit_id])
    @habit_log = @habit.habit_logs.first_or_initialize(log_date: params[:log_date])
    # authorize @habit
  end
end
