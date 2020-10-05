class QuestionnaireAttemptPolicy < ApplicationPolicy
  def index?
    true
  end

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
      scope.for_user(@user)
    end
  end
end