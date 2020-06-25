class KeyActivityPolicy < ApplicationPolicy
  attr_reader :user, :key_activity

  def initialize(user, key_activity)
    @user = user
    @key_activity = key_activity
  end

  def index?
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