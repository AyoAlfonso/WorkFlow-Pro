class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  # after_filter :handle_failed_login, :only => :new
  respond_to :json
  #default for json api
  # protect_from_forgery if: -> { request.format.html? }

  def create
    @attempting_user = User.find_by(email: params["session"]["user"]["email"])

    if "microsoft_oauth" ==  @attempting_user.provider
        return render json: { error: "This user registered with Microsoft. Please login with the Microsoft Button", error_type: "microsoft_oauth"}, status: 301
    end
    if "google_auth" ==  @attempting_user.provider
       return render json: { error: "This user registered with Google. Please login with the Google Button",  error_type: "google_auth"}, status: 301
  
    end
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end
end
