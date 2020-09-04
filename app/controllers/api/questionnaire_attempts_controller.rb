class Api::QuestionnaireAttemptsController <  Api::ApplicationController 
  respond_to :json

  def create
    json_representation = {
      answers: params[:answers],
      steps: params[:steps],
      rendered_steps: params[:rendered_steps]
    }.to_json
    #do not use strong params here since the answers, steps, rendered steps are free form objects

    questionnaire = Questionnaire.find(params[:questionnaire_id])

    steps = permit_array_param_and_convert_to_hash(params[:steps])
    rendered_steps = permit_array_param_and_convert_to_hash(params[:rendered_steps])

    @questionnaire_attempt = QuestionnaireAttempt.new({
      user_id: current_user.id,
      questionnaire_id: params[:questionnaire_id],
      answers: params[:answers],
      steps: steps,
      rendered_steps: rendered_steps,
      completed_at: Time.now,
      json_representation: json_representation,
      emotion_score: questionnaire.name == "Evening Reflection" ? emotion_to_score_conversion(params[:answers].first) : nil
    })
    authorize @questionnaire_attempt
    @questionnaire_attempt.save!
    render json: @questionnaire_attempt
  end

  def personal_planning
    if [1, 2, 3].include? current_user.time_in_user_timezone.wday # Monday to Wednesday
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).for_user(current_user).within_last_week(current_user.time_in_user_timezone)
    elsif [0, 5, 6].include? current_user.time_in_user_timezone.wday # Friday to Sunday
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).for_user(current_user).within_current_week(current_user.time_in_user_timezone)
    end
    authorize @questionnaire_attempts

    summary = {what_happened: [], improvements: [], highest_good: [], wins: [], lessons: [], gratitude_am: [], gratitude_pm: []}

    @questionnaire_attempts.each do |qa|
      day_of_the_week = qa.completed_at.strftime('%A')
      qa.rendered_steps.each do |rs|
        case rs[:id]
        when "what-happened"
          summary[:what_happened].push({value: rs[:value], day: day_of_the_week})
        when "improvements"
          summary[:improvements].push({value: rs[:value], day: day_of_the_week})
        when "highest-good"
          summary[:highest_good].push({value: rs[:value], day: day_of_the_week})
        when "wins"
          summary[:wins].push({value: rs[:value], day: day_of_the_week})
        when "lessons"
          summary[:lessons].push({value: rs[:value], day: day_of_the_week})
        when "gratitude-am"
          summary[:gratitude_am].push({value: rs[:value], day: day_of_the_week})
        when "gratitude-pm"
          summary[:gratitude_pm].push({value: rs[:value], day: day_of_the_week})
        end
      end
    end

    render json: summary
  end

  private

  def questionnaire_attempt_params
    params.permit(:id, :user_id, :questionnaire_id, :completed_at, :answers => [], :steps => [], :rendered_steps => [])
  end

  def permit_array_param_and_convert_to_hash(array)
    array.map do |param|
      param.permit!.to_h
    end
  end

  def emotion_to_score_conversion(emotion_value)
    emotion_value.to_i > 0 ? emotion_value : nil
  end
end