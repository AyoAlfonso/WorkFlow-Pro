class QuarterlyGoalPolicy < ApplicationPolicy

  def index?
    true
  end

  def create?
    true
  end

  def show?
    @user.companies.pluck(:id).include?(@record.annual_initiative.company_id) || @record.owned_by == @user
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

  def create_milestones?
    @record.created_by == @user || @record.owned_by == @user || @user.company_admin?
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