class KeyPerformanceIndicatorPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def show?
    true
  end

  def update?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def destroy?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def close_kpi?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
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
