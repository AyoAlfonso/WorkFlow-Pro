class Api::SummariesController < Api::ApplicationController
  
  def journals_by_date
    if params[:start_date].present? && params[:end_date].present?
      @journal_entries = policy_scope(JournalEntry).between(params[:start_date].to_date.beginning_of_day, params[:end_date].to_date.end_of_day).sort_by_created_at
    else
      @journal_entries = policy_scope(JournalEntry).sort_by_created_at
    end
    authorize @journal_entries, :index?
    @dates = @journal_entries.map{ |je| current_user.convert_to_their_timezone(je.created_at).strftime("%a, %b %e") }.uniq
    render "api/summaries/journals_by_date"
  end
  
  def meetings_by_date
    if params[:filters].present?
      filters = JSON.parse(params[:filters])
      if filters["team_id"].present?
        @meetings = policy_scope(Meeting).where(team_id: filters["team_id"]).has_notes.where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      elsif filters["user_id"].present?
        @meetings = policy_scope(Meeting).where(hosted_by_id: filters["user_id"]).where(team_id: nil).has_notes.where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      else
        @meetings = policy_scope(Meeting).has_notes.where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      end
    else
      @meetings = policy_scope(Meeting).has_notes.sort_by_start_time
    end
    authorize @meetings
    @dates = @meetings.map{ |meeting| current_user.convert_to_their_timezone(meeting.start_time).strftime("%a, %b %e") }.uniq
    render "api/summaries/meetings_by_date"
  end
end
