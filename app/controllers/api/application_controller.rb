class CurrentContext
  attr_reader :user, :company

  def initialize(user, company)
    @user = user
    @company = company
  end
end


class Api::ApplicationController < ActionController::API
  include Pundit

  before_action :authenticate_user!
  before_action :set_current_company
  after_action :verify_authorized, except: :index, unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  #precedence highest when delcared last for rescue_from
  rescue_from StandardError, with: :fallback_error
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :authorization_not_performed_error
  rescue_from Pundit::PolicyScopingNotPerformedError, with: :policy_scoping_not_performed_error

  helper_method :current_company

  def pundit_user
    CurrentContext.new(current_user, current_company)
  end
  
  def skip_pundit?
    false
  end

  def current_company
    @current_company
  end

  private
  def set_current_company
    @current_company ||= request.headers["HTTP_CURRENT_COMPANY_ID"].present? ? Company.find(request.headers["HTTP_CURRENT_COMPANY_ID"]) : Company.find(current_user.current_selected_company_id) if current_user.present?
  end

  def policy_scoping_not_performed_error
    raise "Policy scope not performed"
  end

  def authorization_not_performed_error
    raise "Authorization not performed"
  end

  def user_not_authorized
    render json: { message: I18n.t("unauthorized") }, status: 403
  end

  def fallback_error(exception)
    render json: { message: exception.to_s}, status: :bad_request #:unprocessable_entity
  end

end
