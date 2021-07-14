require "uri"
require "json"
require "net/http"

class InvitationsController < Devise::InvitationsController
  def update_resource_params
    url = URI("https://api.encharge.io/v1/hooks/9ef21985-54e8-41ba-84a5-e0966a3db3f5")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true
    user = User.find_by_invitation_token(params[:user][:invitation_token], true)
    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = "application/json"
    request.body = JSON.dump({ "email": user[:email],
                              "firstName": params[:user][:first_name],
                              "lastName": params[:user][:last_name],
                              "role": params[:user][:title] })
    https.request(request)
    params.require(:user).permit(:password, :password_confirmation, :invitation_token, :first_name, :last_name,:title)
  end
end
