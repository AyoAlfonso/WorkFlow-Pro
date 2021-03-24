class Api::UserPulsesController < Api::ApplicationController
  respond_to :json

  def create_or_update
    user_pulse = UserPulse.where("user_id = ? AND DATE(completed_at) = ?", current_user.id, current_user.time_in_user_timezone).first_or_initialize
    user_pulse.update!(pulse_selector_params)
  end

  

  private
  def pulse_selector_params
    params.require(:user_pulse).permit(:score, :feeling)
  end
end
