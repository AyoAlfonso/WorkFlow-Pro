class Api::ForumsController < Api::ApplicationController

  #if user is part of team, they can create the meetings
  def create_meetings_for_year
    @team = Team.find(params[:team_id])
    authorize @team, policy_class: ForumTeamPolicy
    if params[:forum_type] == "Organisation"
      service = OrganisationForumMeetingSetupService.new(current_user, @team, params[:current_year])
    else
    service = ForumMeetingSetupService.new(current_user, @team, params[:current_year])
    end
    service.call

    @meetings = service.fetch_meetings_for_year
    #replace all meetings in the search after the creation
    render "api/meetings/index"
  end

  def search_meetings_by_date_range
    @team = Team.find(params[:team_id])
    authorize @team, policy_class: ForumTeamPolicy

    #TODO: add filtering so its the actual start time if it exists and scheduled_start_time if no actual start_time exists
    #Move scoping to model
    meeting_type = MeetingTemplate.meeting_types[params[:meeting_type]] || 2
    @meetings = Meeting.joins(:meeting_template)
      .where("team_id = ? 
        AND scheduled_start_time >= ?          
        AND scheduled_start_time <= ?               
        AND meeting_templates.meeting_type = ?",
             params[:team_id], params[:start_date].to_date(), params[:end_date].to_date(), meeting_type).order(:scheduled_start_time)
    render "api/meetings/index"
  end
end
