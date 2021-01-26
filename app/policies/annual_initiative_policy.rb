class AnnualInitiativePolicy < ApplicationPolicy
  attr_reader :user, :company, :annual_initiative

  def initialize(user, company, annual_initiative)
    @user = user
    @company = company
    @annual_initiative = annual_initiative
  end

  def index? 
    true
  end

  def create?
    true
  end

  def show?
    @user.companies.pluck(:id).include?(@annual_initiative.company_id) || @annual_initiative.owned_by == @user 
  end

  def update?
    @annual_initiative.created_by == @user || @annual_initiative.owned_by == @user || @user.company_admin?
  end

  def destroy?
    @annual_initiative.created_by == @user || @annual_initiative.owned_by == @user || @user.company_admin?
  end

  def create_key_element?
    @annual_initiative.created_by == @user || @annual_initiative.owned_by == @user || @user.company_admin?
  end

  def team?
    true
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(user, company, scope)
      @user = user
      @company = company
      @scope = scope
    end

    def resolve
      scope.includes([:key_elements, {owned_by: [:user_role, :avatar_attachment, :company]}]).user_current_company(@user)
    end
  end
end