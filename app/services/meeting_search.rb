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
        company_date_for_start_on = company.date_for_start_on(params[:fiscal_year])
            @meetings = case company.organisational_forum_type
            when "3-Hours"
             @meetings.for_meeting_template(MeetingTemplate.organisation_forum_monthly.second.try(:id))
            when "2-Hours"
              @meetings.for_meeting_template(MeetingTemplate.organisation_forum_monthly.first.try(:id))
            else 
            @meetings.for_meeting_template(MeetingTemplate.organisation_forum_monthly.first.try(:id))
            end
         @meetings = @meetings.for_scheduled_start_date_range(company_date_for_start_on.to_datetime, (company_date_for_start_on + 1.year).to_datetime).sort_by_scheduled_start_time_asc
      end
    end
    @meetings
  end

  def search_forum_meeting_scope
    @meetings = scoped_object
    @meetings = @meetings.for_type(params[:meeting_type]) if params[:meeting_type]
    if params[:team_id]
      @meetings = @meetings.team_meetings(params[:team_id])
      if params[:fiscal_year]        
        company = Company.find_first_with_team(params[:team_id])
        company_date_for_start_on = company.date_for_start_on(params[:fiscal_year])
        if params[:meeting_type] != "organisation_forum_monthly"
          @meetings = @meetings.for_scheduled_start_date_range(company_date_for_start_on.to_datetime, (company_date_for_start_on + 1.year).to_datetime).sort_by_scheduled_start_time_asc
        end
      end
    end
    @meetings
  end
end


