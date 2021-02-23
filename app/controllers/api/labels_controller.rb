class Api::LabelsController < Api::ApplicationController
  respond_to :json

  def index
    @labels = labels_for_team.order('created_at DESC')
    render "api/labels/index"
  end

  def create
    record = ActsAsTaggableOn::Tag.where(name: params[:label_object][:label], team_id: params[:label_object][:team_id]).first_or_create
    @labels = labels_for_team.order('created_at DESC')
    render "api/labels/index"
  end

  def skip_pundit?
    true
  end

  private
  def labels_for_team
    team_ids = @current_company.teams.pluck(:id)
    ActsAsTaggableOn::Tag.where(team_id: team_ids).or(ActsAsTaggableOn::Tag.where(team_id: nil))
  end
end
