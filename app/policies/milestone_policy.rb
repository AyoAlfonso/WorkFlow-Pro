class MilestonePolicy < ApplicationPolicy
  def update?
    !user_can_observe_current_company?
  end

  def milestones_for_meeting?
    true
  end

  def create_or_update_onboarding_goals?
    !user_can_observe_current_company?
  end

  def get_onboarding_goals?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
