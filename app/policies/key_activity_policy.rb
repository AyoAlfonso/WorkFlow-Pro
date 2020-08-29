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
    @key_activity.user == @user
  end

  def destroy?
    @key_activity.user == @user
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
      scope.created_by_user(@user)
    end
  end
end