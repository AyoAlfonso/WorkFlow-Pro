class IssuePolicy < ApplicationPolicy

  def index?
    true
  end

  def create?
    true
  end

  def update?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @record.user == @user || (team_ids & @record.user.team_ids).length > 0
  end

  def destroy?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @record.user == @user || (team_ids & @record.user.team_ids).length > 0
  end

  def issues_for_meeting?
    true
  end

  def issues_for_team?
    true
  end
  
  def meeting_recap?
    true
  end

  def resort_index?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.optimized.user_current_company(@company.id).owned_by_self_or_team_members(@user)
    end
  end
end