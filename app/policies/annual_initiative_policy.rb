class AnnualInitiativePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def duplicate?
    !user_can_observe_current_company?
  end

  def show?
    @record.owned_by == @user || @record.company.present? && (user_is_part_of_this_company?(@record.company) || user_can_observe_current_company?)
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

  def update_key_element?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def delete_key_element?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
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

  def close_initiative?
    @record.created_by == @user || @record.owned_by == @user || user_is_company_admin_of_current_company?
  end

  def get_user_goals?
     !user_can_observe_current_company?
  end

  def get_company_goals?
    !user_can_observe_current_company?
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.includes([:key_elements, { owned_by: { avatar_attachment: :blob } }])
    end
  end
end
