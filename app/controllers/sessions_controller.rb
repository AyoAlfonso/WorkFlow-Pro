class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token

  #default for json api
  # protect_from_forgery if: -> { request.format.html? }

  def create
    @attempting_user = User.find_by(email: params["session"]["user"]["email"])

   if @attempting_user.present?
    if "microsoft_oauth" ==  @attempting_user.provider
      return render json: { error: "Your account is set up for SSO with Microsoft. Use the button below to access your account", error_type: "microsoft_oauth"}, status: 301
    end
    if "google_auth" ==  @attempting_user.provider
      return render json: { error: "Your account is set up for SSO with Google. Use the button below to access your account",  error_type: "google_auth"}, status: 301
    end
    if "no_auth" ==  @attempting_user.provider
      return render json: { error: "Your account is set up for SSO with Google/Microsoft. Use one of the buttons below to access your account",  error_type: "no_auth_yet"}, status: 301
    end
   end

    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  respond_to :json
end
