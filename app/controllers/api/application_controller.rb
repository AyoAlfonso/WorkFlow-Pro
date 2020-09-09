class Api::ApplicationController < ActionController::API
  include Pundit

  before_action :authenticate_user!
  after_action :verify_authorized, except: :index, unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  #precedence highest when delcared last for rescue_from
  rescue_from StandardError, with: :fallback_error
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, Pundit::PolicyScopingNotPerformedError, with: :developer_review_error
  
  def skip_pundit?
    false
  end

  private

  def developer_review_error
    raise "Developer should review Authorization scope"
  end

  def user_not_authorized
    render json: { message: I18n.t("unauthorized") }, status: 403
  end

  def fallback_error(exception)
    render json: { message: exception.to_s}, status: :bad_request #:unprocessable_entity
  end

end
