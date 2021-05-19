class DailyLogPolicy < ApplicationPolicy
  def create_or_update?
    @record.user == @user && !user_can_observe_current_company?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.where(user: @user)
    end
  end

end