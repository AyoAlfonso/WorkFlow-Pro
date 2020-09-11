class IssuePolicy < ApplicationPolicy
  attr_reader :user, :issue

  def initialize(user, issue)
    @user = user
    @issue = issue
  end

  def index?
    true
  end

  def create?
    true
  end

  def update?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @issue.user == @user || (team_ids & @issue.user.team_ids).length > 0
  end

  def destroy?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    @issue.user == @user || (team_ids & @issue.user.team_ids).length > 0
  end

  def issues_for_meeting?
    true
  end
  
  def meeting_recap?
    true
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.owned_by_self_or_team_members(@user)
    end
  end
end