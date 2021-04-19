class QuestionnaireAttemptPolicy < ApplicationPolicy
  def create?
    !user_can_observe_current_company?
  end

  def questionnaire_summary?
    true
  end

  def questionnaire_attempts_by_date?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.for_user(@user)
    end
  end
end