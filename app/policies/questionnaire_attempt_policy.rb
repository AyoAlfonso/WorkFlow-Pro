class QuestionnaireAttemptPolicy < ApplicationPolicy
  def create?
    true
  end

  def personal_planning?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end