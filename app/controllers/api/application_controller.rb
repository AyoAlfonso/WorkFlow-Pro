class Api::ApplicationController < ActionController::API
  include Pundit

  before_action :authenticate_user!, except: [:load_static_data]
  before_action :set_current_company, :set_current_user
  after_action :verify_authorized, except: [:index, :load_static_data], unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  #precedence highest when delcared last for rescue_from
  rescue_from StandardError, with: :fallback_error
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :authorization_not_performed_error
  rescue_from Pundit::PolicyScopingNotPerformedError, with: :policy_scoping_not_performed_error

  helper_method :current_company
  # TODO: Apply a nuanced error handler
  # def append_info_to_payload(payload)
  #         super
  #       case 
  #           when payload[:status] == 200
  #             payload[:level] = "INFO"
  #           when payload[:status] == 302
  #             payload[:level] = "WARN"
  #           else
  #             payload[:level] = "ERROR"
  #           end
  # end

  def pundit_user
    CurrentContext.new(current_user, current_company)
  end

  def skip_pundit?
    false
  end

  def current_company
    @current_company
  end

  def load_static_data
    @static_data = StaticDataService.call
    render json: @static_data, status: 200
  end

  private

  def set_current_company
    @current_company ||= request.headers["HTTP_CURRENT_COMPANY_ID"].present? ? Company.find(request.headers["HTTP_CURRENT_COMPANY_ID"]) : current_user.default_selected_company if current_user.present?
  end


  def set_current_user
    User.current = current_user
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
    render json: { message: exception.to_s }, status: :bad_request #:unprocessable_entity
  end
end
