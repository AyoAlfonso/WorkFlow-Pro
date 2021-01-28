class QuestionnaireAttemptPolicy < ApplicationPolicy
  def create?
    true
  end

  def personal_planning?
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