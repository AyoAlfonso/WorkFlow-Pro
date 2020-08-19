class HabitPolicy < ApplicationPolicy
  attr_reader :user, :habit

  def initialize(user, habit)
    @user = user
    @habit = habit
  end

  def index?
    true
  end

  def create?
    true
  end

  def show?
    @habit.user == @user
  end

  def update?
    @habit.user == @user
  end

  def destroy?
    @habit.user == @user
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.owned_by_user(@user)
    end
  end
end