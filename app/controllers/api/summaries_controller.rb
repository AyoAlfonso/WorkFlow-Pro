class Api::SummariesController < Api::ApplicationController
  
  def questionnaire_attempts_by_date
    if params[:start_date].present? && params[:end_date].present?
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).where(completed_at: params[:start_date].to_date.beginning_of_day..params[:end_date].to_date.end_of_day).sort_by_completed_at
    else
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).sort_by_completed_at
    end
    authorize @questionnaire_attempts
    @dates = @questionnaire_attempts.map{ |qa| qa.completed_at.strftime("%a, %b%e") }.uniq
    render "api/summaries/questionnaire_attempts_by_date"
  end
  
  def meetings_by_date
    if params[:filters].present?
      filters = JSON.parse(params[:filters])
      if filters["team_id"].present?
        @meetings = policy_scope(Meeting).where(team_id: filters["team_id"]).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      elsif filters["user_id"].present?
        @meetings = policy_scope(Meeting).where(hosted_by_id: filters["user_id"]).where(team_id: nil).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      else
        @meetings = policy_scope(Meeting).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      end
    else
      @meetings = policy_scope(Meeting).sort_by_start_time
    end
    authorize @meetings
    @dates = @meetings.map{ |meeting| meeting.start_time.strftime("%a, %b%e") }.uniq
    render "api/summaries/meetings_by_date"
  end
end
