class Api::LabelsController < Api::ApplicationController
  respond_to :json

  def index
    @labels = labels_for_team.order('created_at DESC')
    render "api/labels/index"
  end

  def create
    label = params[:label_object][:label]
    if label == "Personal"
      ActsAsTaggableOn::Tag.where(name: label, user_id: @current_user.id).first_or_create
    elsif label == "Company"
      ActsAsTaggableOn::Tag.where(name: label, company_id: @current_company.id).first_or_create
    else
      ActsAsTaggableOn::Tag.where(name: label, team_id: params[:label_object][:team_id]).first_or_create
    end
    @labels = labels_for_team.order('created_at DESC')
    render "api/labels/index"
  end

  def skip_pundit?
    true
  end

  private
  def labels_for_team
    team_ids = @current_company.teams.pluck(:id)
    ActsAsTaggableOn::Tag.where(team_id: team_ids)
      .or(ActsAsTaggableOn::Tag.where(company_id: @current_company.id))
      .or(ActsAsTaggableOn::Tag.where(user_id: @current_user.id))
      .most_used(5)
  end
end
