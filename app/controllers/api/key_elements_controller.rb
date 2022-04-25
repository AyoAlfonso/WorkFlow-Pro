class Api::KeyElementsController < Api::ApplicationController
  include UserActivityLogHelper
  include StatsHelper
  after_action :record_activities, only: [:check_in_key_elements, :update]
  
  respond_to :json
  before_action :set_key_element, only: [:update]
  before_action :skip_authorization, only: :check_in_key_elements

  def check_in_key_elements
    @quarterly_goal_key_elements = policy_scope(KeyElement).current_user_and_elementable_type(current_user, "QuarterlyGoal")
    @subinitiative_key_elements = policy_scope(KeyElement).current_user_and_elementable_type(current_user, "SubInitiative")
    authorize  @subinitiative_key_elements
    authorize @quarterly_goal_key_elements
    render "/api/key_elements/key_elements_for_check_in"
  end

  def update
    @key_element.update!(key_element_params)
    render "api/key_elements/update"
  end

  def key_element_params
    params.require(:key_element).permit(:id, :status, :completion_current_value)
  end

  def set_key_element
    @key_element = policy_scope(KeyElement).find(params[:id])
    authorize @key_element
  end

  def record_activities
    record_activity("")
  end 
end
