class QuarterlyGoalPolicy < ApplicationPolicy
  attr_reader :user, :quarterly_goal

  def initialize(user, quarterly_goal)
    @user = user
    @quarterly_goal = quarterly_goal
  end

  def index?
    true
  end

  def create?
    true
  end

  def show?
    @quarterly_goal.annual_initiative.company_id == @user.company_id
  end

  def update?
    @quarterly_goal.created_by == @user || @quarterly_goal.owned_by == @user
  end

  def destroy?
    @quarterly_goal.created_by == @user || @quarterly_goal.owned_by == @user
  end

  def create_key_element?
    @quarterly_goal.created_by == @user || @quarterly_goal.owned_by == @user
  end

  def create_milestones?
    @quarterly_goal.created_by == @user || @quarterly_goal.owned_by == @user
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