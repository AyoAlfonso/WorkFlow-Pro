class UserActivityLogPolicy < ApplicationPolicy
  def index?
     user_is_part_of_current_company? && @user.company_admin?(company)
  end

  class Scope
    attr_reader :context, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.sort_by_company(@company)
    end
  end
end
