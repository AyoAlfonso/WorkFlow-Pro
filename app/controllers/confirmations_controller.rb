class ConfirmationsController < Devise::ConfirmationsController
  private
  
  def after_confirmation_path_for(resource_name, resource)
    root_path

    #RESET PASSWORD AND USERNAME PATH

  end
end
