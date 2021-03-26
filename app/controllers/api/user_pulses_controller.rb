class Api::UserPulsesController < Api::ApplicationController
  respond_to :json

  def user_pulse_by_date
    if params[:date] == "Today"
      date = current_user.time_in_user_timezone.to_date
    elsif params[:date] == "Yesterday"
      date = current_user.time_in_user_timezone.to_date - 1.day
    else
      date = current_user.convert_to_their_timezone(params[:date].to_date)
    end
    @user_pulse = current_user.user_pulse_for_display(date)
    authorize current_user, policy_class: UserPulsePolicy
    render json: { user_pulse: @user_pulse }
  end

  def create_or_update
    if params[:id].present?
      user_pulse = UserPulse.find(params[:id])
      user_pulse.update!(pulse_selector_params);
    else
      UserPulse.create!(pulse_selector_params.merge(user_id: current_user.id, completed_at: current_user.convert_to_their_timezone(params[:completed_at].to_datetime).to_date))
    end
    @user = current_user.reload
    authorize @user, policy_class: UserPulsePolicy
    render '/api/users/show'
  end

  private
  def pulse_selector_params
    params.require(:user_pulse).permit(:score, :feeling)
  end
end
