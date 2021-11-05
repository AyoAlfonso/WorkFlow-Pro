class Api::TeamsController < Api::ApplicationController
  include StatsHelper

  respond_to :json
  before_action :set_team, only: [:show, :update, :destroy]
  after_action :verify_policy_scoped, only: [:index, :user_teams, :create_team_and_invite_users], unless: :skip_pundit?

  def index
    @teams = policy_scope(Team).all
    render "api/teams/index"
  end

  def show
    fetch_additional_data
    render "api/teams/show"
  end

  def update
    if params[:users]
      @team.update!({ name: params[:team_name], team_user_enablements_attributes: team_user_enablement_attribute_parser(params[:users]) })
    else
      existing_executive_team = Team.where(company_id: @team.company.id, executive: 1).first
      if params[:executive] == 1 && !existing_executive_team.nil?
        existing_executive_team.update!(executive: 0)
        @team.set_default_executive_team
      elsif existing_executive_team.nil?
        @team.set_default_executive_team
      end
      @team.update!(team_settings_params)
    end
    @teams = policy_scope(Team).all
    fetch_additional_data
    render "api/teams/update"
  end

  def create_team_and_invite_users
    #Split up function into smaller functions
    @team = Team.create!(company_id: current_company.id, name: params[:team_name], settings: {})
    @team.set_default_executive_team if Team.where(company_id: @team.company.id, executive: 1).blank?
    @team.set_default_avatar_color
    authorize @team
    params[:users].each do |user|
      user_record = user.second
      TeamUserEnablement.create!(team_id: @team.id, user_id: user_record["user_id"], role: user_record["meeting_lead"])
    end
    @teams = policy_scope(Team).all
    render "api/teams/index"
  end

  def destroy
    @team.destroy!
    #TODO: make this restful
    @teams = policy_scope(Team).all
    render "api/teams/index"
  end

  private

  def fetch_additional_data
    previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_end = previous_week_start + 6.days
    @average_weekly_user_emotions = @team.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
    @average_team_emotion_score = @team.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def set_team
    @team = TeamPolicy::Scope.new(pundit_user, Team).for_find.find(params[:id])
    authorize @team
  end

  def team_settings_params
    params.require(:team).permit(:id, :executive, :custom_scorecard, settings: [:weekly_meeting_dashboard_link_embed])
  end

  def team_user_enablement_attribute_parser(users)
    @team.team_user_enablements.destroy_all
    users_list = []
    users.each do |user_object|
      user = user_object.second
      users_list.push({
        team_id: @team.id,
        user_id: user[:user_id],
        role: user[:meeting_lead],
      })
    end
    users_list
  end
end
