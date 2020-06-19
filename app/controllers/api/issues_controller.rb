class Api::IssuesController < Api::ApplicationController
  respond_to :json

  def index
    render json: Issue.all
  end
end
