class Api::QuestionnaireAttemptsController <  Api::ApplicationController 
  respond_to :json

  def create
    @questionnaire_attempt = QuestionnaireAttempt.new({
      user_id: current_user.id,
      questionnaire_id: params[:questionnaire_id],
      answers: params[:answers],
      steps: params[:steps],
      rendered_steps: params[:rendered_steps],
      completed_at: params[:completed_at]
    })
    authorize @questionnaire_attempt
    @questionnaire_attempt.save!
    render json: @questionnaire_attempt
  end

  private

  def questionnaire_attempt_params
    params.permit(:id, :user_id, :questionnaire_id, :answers, :steps, :rendered_steps, :completed_at)
  end
end