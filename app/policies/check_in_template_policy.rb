class CheckInTemplatePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def show?
    user_is_part_of_this_company?(@company)
  end

  def update?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def destroy?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end


  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve #system defaults
     scope.sort_by_company(@company)
    end
  end
end
