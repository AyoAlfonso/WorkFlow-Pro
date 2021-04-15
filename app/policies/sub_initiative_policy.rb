class SubInitiativePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    true
  end

  def show?
    user_is_part_of_this_company?(@record.quarterly_goal.annual_initiative.company) || @record.owned_by == @user
  end

  def update?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def destroy?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def create_key_element?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def delete_key_element?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def create_milestones?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def create_or_update_onboarding_goals?
    true
  end

  def get_onboarding_goals?
    true
  end

  def close_goal?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end