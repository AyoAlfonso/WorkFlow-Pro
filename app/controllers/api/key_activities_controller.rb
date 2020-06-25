class Api::KeyActivitiesController < Api::ApplicationController

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity)
    render json: @key_activities
  end
end
