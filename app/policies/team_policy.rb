class TeamPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    team_ids.include?(@record.id) || user_can_observe_current_company?
  end

  def update?
    user_is_part_of_current_company? && (@user.company_admin?(company) || @record.is_lead?(@user))
  end

  def create_team_and_invite_users?
    user_is_part_of_current_company? && (@user.company_admin?(company) || @record.is_lead?(@user))
  end

  def destroy?
    user_is_part_of_current_company? && (@user.company_admin?(company) || @record.is_lead?(@user))
  end

  def create_or_update_onboarding_team? 
    true
  end

  class Scope
    attr_reader :context, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.includes([:team_user_enablements, users: [:default_selected_company, {avatar_attachment: :blob}]]).for_company(@company)
    end

    def for_find
      scope.includes([users: {avatar_attachment: :blob}]).for_company(@company)
    end
  end
end