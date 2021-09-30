class Api::LabelsController < Api::ApplicationController
  include RandomizedColorPickerHelper
  respond_to :json

  def index
    @labels = labels_for_team.order("created_at DESC")
    render "api/labels/index"
  end

  def create
    label_name = params[:label_object][:label]
    team_id = params[:label_object][:team_id]

    if team_id == "personal"
      @label = ActsAsTaggableOn::Tag.where(name: label_name, user_id: @current_user.id).first_or_create
    elsif team_id == "company"
      @label = ActsAsTaggableOn::Tag.where(name: label_name, company_id: @current_company.id).first_or_create
    else
      @label = ActsAsTaggableOn::Tag.where(name: label_name, team_id: params[:label_object][:team_id]).first_or_create
    end

    if @label.color.nil?
      @label.assign_attributes({ color: get_randomized_color })
      @label.save(validate: false)
    end

    @labels = labels_for_team.order("created_at DESC")
    render "api/labels/create"
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
  end
end
