class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  #default for json api
  # protect_from_forgery if: -> { request.format.html? }
  respond_to :json
end
