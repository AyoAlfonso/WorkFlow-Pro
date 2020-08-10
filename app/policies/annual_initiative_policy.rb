class AnnualInitiativePolicy < ApplicationPolicy
  attr_reader :user, :annual_initiative

  def initialize(user, annual_initiative)
    @user = user
    @annual_initiative = annual_initiative
  end

  def index? 
    true
  end

  def create?
    true
  end

  def show?
    @annual_initiative.company_id == @user.company_id || @annual_initiative.owned_by == @user 
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

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end