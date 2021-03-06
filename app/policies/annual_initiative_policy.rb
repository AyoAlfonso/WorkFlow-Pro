class AnnualInitiativePolicy < ApplicationPolicy

  def index? 
    true
  end

  def create?
    true
  end

  def show?
    @user.companies.pluck(:id).include?(@record.company_id) || @record.owned_by == @user 
  end

  def update?
    @record.created_by == @user || @record.owned_by == @user || @user.company_admin?
  end

  def destroy?
    @record.created_by == @user || @record.owned_by == @user || @user.company_admin?
  end

  def create_key_element?
    @record.created_by == @user || @record.owned_by == @user || @user.company_admin?
  end

  def team?
    true
  end

  def create_or_update_onboarding_goals?
    true
  end

  def get_onboarding_goals?
    true
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.includes([:key_elements, {owned_by: [:user_role, :avatar_attachment, :company]}]).user_current_company(@company.id)
    end
  end
end