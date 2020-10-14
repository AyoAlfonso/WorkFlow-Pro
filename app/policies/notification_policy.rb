class NotificationPolicy < ApplicationPolicy
  attr_reader :user, :notification

  def initialize(user, notification)
    @user = user
    @notification = notification
  end

  def index?
    true
  end

  def update?
    @notification.user_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.remove_deprecated
    end
  end

end
