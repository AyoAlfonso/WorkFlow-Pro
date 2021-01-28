class MilestonePolicy < ApplicationPolicy
  def update?
    true
  end

  def milestones_for_meeting?
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