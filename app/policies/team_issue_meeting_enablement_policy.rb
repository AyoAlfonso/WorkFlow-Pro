class TeamIssueMeetingEnablementPolicy < ApplicationPolicy
  attr_reader :user, :team_issue_meeting_enablement

  def initialize(user, team_issue_meeting_enablement)
    @user = user
    @team_issue_meeting_enablement = team_issue_meeting_enablement
  end

  def index?
    true
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