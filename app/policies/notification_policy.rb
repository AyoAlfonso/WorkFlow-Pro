class NotificationPolicy < ApplicationPolicy

  def index?
    true
  end

  def update?
    @record.user_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.remove_deprecated
    end
  end

end
