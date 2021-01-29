class MeetingSearch
  attr_accessor :scoped_object, :params
  
  def initialize(scoped_object, params)
    self.scoped_object = scoped_object || Meeting
    self.params = params || {}
  end
  
  def search
    @meetings = scoped_object
    @meetings = @meetings.for_type(params[:meeting_type]) if params[:meeting_type]
    if params[:team_id]
      @meetings = @meetings.team_meetings(params[:team_id])
      if params[:fiscal_year]
        company = Company.find_first_with_team(params[:team_id])
        date_for_start_on = company.try(:date_for_start_on, params[:fiscal_year].to_i)
        @meetings = @meetings.for_scheduled_start_date_range(date_for_start_on.to_datetime, (date_for_start_on+1.year).to_datetime).sort_by_scheduled_start_time_asc
      end
    end
    @meetings
  end

end