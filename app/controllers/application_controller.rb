class ApplicationController < ActionController::Base
  layout :layout_by_resource
  # before_action :authenticate_user!
  helper_method :record_activity
  
  def layout_by_resource
    devise_controller? ? "devise" : "application"
  end

end
