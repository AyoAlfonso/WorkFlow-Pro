                                                                                                                
# require "httparty"
require "net/http"
require "json"
require "uri"

class  AuthorizationController <  ApplicationController                              
  skip_before_action :verify_authenticity_token
 def google_oauth2

   url = URI.parse("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=#{params["access_token"]}")                  

  http = Net::HTTP.new(url.host, url.port);
  http.use_ssl = true
  request = Net::HTTP::Get.new(url)

  # we want to add to comp
  response = http.request(request)
  if JSON.parse(response.body)["email_verified"] 
   @email = JSON.parse(response.body)["email"]
   
  end
  
  # @user = User.find(2)
  # User.find
  token = @user.generate_jwt(@user)                      
  headers['Authorization'] = "Bearer " + (token).to_s
  render json:@user
 end
end

