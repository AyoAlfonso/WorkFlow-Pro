class HabitPolicy < ApplicationPolicy

  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def update?
    @record.user == @user
  end

  def destroy?
    @record.user == @user
  end

  class Scope
    attr_reader :pyns, :scorecard

    def initialize(context, scope)
      @user = context.user
      @scorecard = scorecard
      @pyns = pyns
    end

    def resolve
      scope.includes([:pyns, :scorecard]).owned_by_user(@user)
    end
  end
end