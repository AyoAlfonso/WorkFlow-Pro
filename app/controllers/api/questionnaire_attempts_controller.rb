class Api::QuestionnaireAttemptsController <  Api::ApplicationController 
  respond_to :json

  before_action :skip_authorization, only: [:personal_planning]

  def index
    if params[:start_date].present? && params[:end_date].present?
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).where(completed_at: params[:start_date].to_date.beginning_of_day..params[:end_date].to_date.end_of_day).sort_by_completed_at
    else
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).sort_by_completed_at
    end
    authorize @questionnaire_attempts
    @dates = @questionnaire_attempts.map{ |qa| qa.completed_at.strftime("%a, %b%e") }.uniq
    @data = @dates.map{ |date| {date: date, items: @questionnaire_attempts.select { |qa| qa.completed_at.strftime("%a, %b%e") == date } } }
    render json: @data
  end

  def index
    @questionnaire_attempts = policy_scope(QuestionnaireAttempt).sort_by_completed_at
    authorize @questionnaire_attempts
    @dates = @questionnaire_attempts.map{ |qa| qa.completed_at.strftime("%a, %b%e") }.uniq
    @data = @dates.map{ |date| {date: date, items: @questionnaire_attempts.select { |qa| qa.completed_at.strftime("%a, %b%e") == date } } }
    render json: @data
  end

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
      questionnaire_type: questionnaire.name,
      answers: params[:answers],
      steps: steps,
      rendered_steps: rendered_steps,
      completed_at: Time.now,
      json_representation: json_representation,
      emotion_score: questionnaire.name == "Evening Reflection" ? emotion_to_score_conversion(rendered_steps) : nil
    })
    authorize @questionnaire_attempt
    if @questionnaire_attempt.save!
      @current_daily_log = DailyLog.find(current_user.current_daily_log.id)
      @current_daily_log[questionnaire.name.delete(' ').underscore] = true unless questionnaire.name == "Thought Challenge"
      @current_daily_log.save!
    end
    render json: @current_daily_log
  end

  def personal_planning
    if current_user.time_in_user_timezone.wday == 1 # Monday
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).within_last_week(current_user.time_in_user_timezone)
    elsif [0, 2, 3, 4, 5, 6].include? current_user.time_in_user_timezone.wday # Tuesday to Sunday
      @questionnaire_attempts = policy_scope(QuestionnaireAttempt).within_current_week(current_user.time_in_user_timezone)
    else
      render json: { error: "You can't do your Weekly Personal Planning at this time", status: 412 }
      return
    end

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

  def emotion_to_score_conversion(rendered_steps)
    rendered_steps.detect { |rs| rs["id"] == "rating" }["value"]
  end
end