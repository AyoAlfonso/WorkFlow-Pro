                                                                                                                
# require "httparty"
require "net/http"
require "json"
require "uri"

class  AuthorizationController <  ApplicationController                              
  skip_before_action :verify_authenticity_token
 def google_oauth2
   url = URI.parse("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{params["access_token"]}")                  
  #  https = Net::HTTP.new(url.host, url.port)          
  #   https.use_ssl = true
  # request = Net::HTTP::Get.new(url)

  #     request["Content-Type"] = "application/json"
  # response  =   https.request(request)
      #  response.
  google_response = Net::HTTP.get_response(url)

  #  if @user.persisted?
  #  @user = User.create_user_for_google(response)     
  @user = User.find(2) 

   token= @user.generate_jwt(@user)                      
  #  @user.save
  # sign_in_and_redirect @user, event: :authentication
  #  set_headers(token)
    headers['Authorization'] = "Bearer " + (token).to_s
   render json:@user
 end

#  private                                            
    # def set_headers(token)
  
    # headers['client'] =  (token['client']).to_s
    # headers['expiry'] =  (token['expiry']).to_s
    # headers['uid'] = @user.id             
    # headers['token-type'] = (token['token-type']).to_s                  
    # end

end

