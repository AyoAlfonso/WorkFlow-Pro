class Api::ApplicationController < ActionController::API
  include Pundit

  before_action :authenticate_user!
  after_action :verify_authorized, except: :index, unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def skip_pundit?
    false
  end

  private

  def user_not_authorized
    render json: { status: 403, message: I18n.t("unauthorized") }
  end
end
