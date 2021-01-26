class MeetingPolicy < ApplicationPolicy
  attr_reader :user, :company, :meeting

  def initialize(user, company, meeting)
    @user = user
    @company = company
    @meeting = meeting
  end

  def index?
    true
  end

  def search?
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
      @user.team_lead_for?(meeting.team)
    else
      true
    end
  end

  def update?
    if (meeting.meeting_type == "team_weekly")
      meeting.hosted_by == @user || @user.team_lead_for?(meeting.team)
    else
      meeting.hosted_by == @user
    end
  end

  def destroy?
    false
  end

  def team_meetings?
    @user.teams_intersect?(@meeting.map { |m| m.team })
  end

  def meeting_recap?
    @user.teams_intersect?(@meeting.map { |m| m.team })
  end

  def meetings_by_date?
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