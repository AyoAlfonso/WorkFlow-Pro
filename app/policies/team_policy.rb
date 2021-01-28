class TeamPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    team_ids.include?(@record.id)
  end

  def update?
    (@user.company_admin? || @record.is_lead?(@user)) && @user.companies.include?(@record.company)
  end

  class Scope
    attr_reader :context, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.includes([:team_user_enablements]).for_company(@company)
    end
  end
end