class ForumMeetingSetupService
  #sets up the next year of meetings for a forum
  attr_accessor :team, :company, :fiscal_year, :creator

  def initialize(creator, team, fiscal_year)
    self.team = team
    self.company = team.company
    self.creator = creator
    self.fiscal_year = fiscal_year
    raise "Error during setup of forum for year" if self.team.blank? || self.fiscal_year.blank?
  end

  def call
    #finds each month and creates a new meeting for any month that does not contain it
    meetings_this_year = MeetingSearch.new(Meeting, {team_id: team.id, fiscal_year: fiscal_year, meeting_type: :forum_monthly}).search
    already_created_months = meetings_this_year.map{|meeting| meeting.scheduled_start_time.strftime("%B %Y")}.uniq
    initial_date = company.date_for_start_on(fiscal_year)
    months_requiring_meetings = 12.times.map{|i| (initial_date+i.months) }.reject{|date| already_created_months.include?(date.strftime("%B %Y"))}
    
    meeting_template_id = MeetingTemplate.forum_monthly.first.try(:id)
    raise "No forum monthly template seeded" if meeting_template_id.blank?
    new_meetings = months_requiring_meetings.map do |meeting_date|
      Meeting.new({
        meeting_template_id: meeting_template_id, 
        scheduled_start_time: meeting_date.to_datetime,
        hosted_by_id: user.id,
        host_name: user.full_name,
        current_step: 0})
    end
    Meeting.upsert_all(new_meetings)
    #upsert the new meetings in place
  end

  def fetch_meetings_for_year
    MeetingSearch.new(Meeting, {team_id: team.id, fiscal_year: fiscal_year, meeting_type: :forum_monthly}).search
  end
  
end
