class Api::DailyLogsController < Api::ApplicationController
  respond_to :json

  def index
    if params[:date].blank?
      #return error, will not return all daily logs
      raise ArgumentError.new("Missing date for viewing daily log.")
    else
      date = params[:date].to_date
      @daily_log = policy_scope(DailyLog).find_by(log_date: date)
      @daily_log = current_user.daily_logs.create(log_date: date) if @daily_log.blank?

      render json: { daily_log: @daily_log }
    end
  end
end
