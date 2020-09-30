class TeamIssuePolicy < ApplicationPolicy
  attr_reader :user, :team_issue

  def initialize(user, team_issue)
    @user = user
    @team_issue = team_issue
  end

  def index?
    true
  end

  def update?
    @user.teams.map{ |t| t.id }.include?(@team_issue.team_id)
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