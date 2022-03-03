
class KeyElementPolicy < ApplicationPolicy
  def check_in_key_elements?
    !user_can_observe_current_company?
  end

  def update?
      @record.owned_by == @user || user_is_company_admin_of_current_company?
  end 
  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
       scope.all
    end
  end
end