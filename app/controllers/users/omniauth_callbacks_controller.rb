class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    # binding.pry
      # You need to implement the method below in your model (e.g. app/models/user.rb)
      @user = User.find(2)
      User.from_omniauth(request.env['omniauth.auth'])
  
      # if @user.persisted?
      # token = issue_token(@user).crete
      # response.set_header('authorization', token)
      # render json: { success: true,
      #                user: @user,
      #               #  token: token,
      #               #  google_token: @user.access_token,
      #                message: "Logged in successfully." }
      # else
      # render json: { success: false,
      #                error: @user.errors.full_messages.join("\n"),
      #                message: 'Google sign in unsuccessful.' }
      # end

       if @user.persisted?
        flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
        sign_in_and_redirect @user, event: :authentication
      else
        session['devise.google_data'] = request.env['omniauth.auth'].except('extra') # Removing extra as it can overflow some session stores
        redirect_to '/', alert: @user.errors.full_messages.join("\n")
      end

    def failure
      set_flash_message! :alert, :failure, kind: OmniAuth::Utils.camelize(failed_strategy.name), reason: failure_message
      render json: { success: false, message: 'Google authentication failed.', reason: failure_message, kind: OmniAuth::Utils.camelize(failed_strategy.name) }
    end
  end
# end
