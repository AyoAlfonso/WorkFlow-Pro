                                                                                                                
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
  @token = ""
  if JSON.parse(response.body)["email_verified"] 
   @email = JSON.parse(response.body)["email"]
   @user  = User.find_by(email: @email)
    if @user.present?
      @user.provider = "google_auth"
      @user.save(validate: false)
      @user_company_enablement = UserCompanyEnablement.find_by(user_id: @user.id)
      @token = @user.generate_jwt(@user) if @user && @user_company_enablement
      headers['Authorization'] = "Bearer " + (@token).to_s
      render json:@user
    else
      return render json: { error: "This user doesn't exist in our records", status: 412 } 
    end
  end
 end

  def microsoft_oauth2
    @token = ""
      if params["username"]
        @email = params["username"]
        @user = User.find_by(email: @email)
        @user.provider = "microsoft_oauth"
        @user.save(validate: false)
        @user_company_enablement = UserCompanyEnablement.find_by(user_id: @user.id)
        @token = @user.generate_jwt(@user) if @user && @user_company_enablement
        headers['Authorization'] = "Bearer " + (@token).to_s
        return render json:@user
      else
        return  render json: { error: "This user doesn't exist in our records", status: 412 } 
      end

  end        
  
end

