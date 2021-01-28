class TeamIssuePolicy < ApplicationPolicy

  def index?
    true
  end

  def update?
    @user.teams.map{ |t| t.id }.include?(@record.team_id)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.owned_by_self_or_team_members(@user)
    end
  end
end