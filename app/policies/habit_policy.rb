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
      scope.created_by_user(User.first)
    end
  end
end