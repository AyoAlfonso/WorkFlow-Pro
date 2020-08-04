class Api::QuestionnairesController < Api::ApplicationController
  respond_to :json

  def index
    @questionnaires = policy_scope(Questionnaire).all
    render json: @questionnaires
  end
end