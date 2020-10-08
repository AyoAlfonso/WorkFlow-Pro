class KeyActivityPolicy < ApplicationPolicy
  attr_reader :user, :key_activity

  def initialize(user, key_activity)
    @user = user
    @key_activity = key_activity
  end

  def index?
    true
  end

  def create?
    true
  end

  def update?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @key_activity.user == @user || (team_ids & @key_activity.user.team_ids).length > 0
  end

  def destroy?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @key_activity.user == @user || (team_ids & @key_activity.user.team_ids).length > 0
  end

  def created_in_meeting?
    true
  end

  def meeting_recap?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.optimized.owned_by_self_or_team_members(@user)
    end
  end
end