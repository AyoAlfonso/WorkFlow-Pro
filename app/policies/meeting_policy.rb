class MeetingPolicy < ApplicationPolicy
  attr_reader :user, :meeting

  def initialize(user, meeting)
    @user = user
    @meeting = meeting
  end

  def index?
    true
  end

  def show?
    if (meeting.team_id)
      team_ids = @user.team_user_enablements.pluck(:team_id)
      team_ids.include?(meeting.team_id)
    else
      meeting.hosted_by == @user
    end
  end

  def create?
    if (meeting.meeting_type == "team_weekly")
      @user.company_admin?
    else
      true
    end
  end

  def update?
    @user.company_admin?
  end

  def destroy?
    @user.company_admin?
  end

  def team_meetings?
    @user.teams_intersect?(@meeting.map { |m| m.team })
  end

  def meeting_recap?
    @user.teams_intersect?(@meeting.map { |m| m.team })
  end

  def notes?
    true
  end
  
  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.optimized.from_user_teams_or_hosted_by_user(@user)
    end
  end

end