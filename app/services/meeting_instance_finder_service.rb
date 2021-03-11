class MeetingInstanceFinderService < ApplicationService
  include StatsHelper
  #looks for the meeting template type and looks for the correct instance to identify the first instance of the meeting if it savailable

  attr_accessor :meeting_scope, :meeting_template_id, :meeting_template, :on_date_time

  def initialize(meeting_scope, meeting_template_id, on_date_time)
    @meeting_scope = meeting_scope
    @meeting_template_id = meeting_template_id
    @meeting_template = MeetingTemplate.find(meeting_template_id)
    @on_date_time = on_date_time
  end

  def call
    raise ArgumentError.new("Invalid meeting instance search parameters") if @meeting_template.blank? || @meeting_scope.nil? || @on_date_time.blank?
    case @meeting_template.meeting_type
    when "personal_daily"
      #based on today's date 00:00 - 23:59
      @meeting_scope.with_template(@meeting_template_id).for_day_of_date(on_date_time)
    when "team_weekly", "personal_weekly"
      week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(on_date_time)
      @meeting_scope.with_template(@meeting_template_id).for_week_of_date(week_to_review_start_time)
    when "forum_monthly", "personal_monthly"
      @meeting_scope.with_template(@meeting_template_id).for_month_of_date(on_date_time)
    else
      raise ArgumentError.new("Meeting type not implemented for instance search")
    end

  end
end