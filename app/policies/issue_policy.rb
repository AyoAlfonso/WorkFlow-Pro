class IssuePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def duplicate?
    !user_can_observe_current_company?
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

  def toggle_vote?
    user_is_part_of_current_company?
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
      scope.includes([:label_taggings, :labels]).optimized.user_current_company(@company.id).owned_by_self_or_team_members(@user)
    end
  end
end
