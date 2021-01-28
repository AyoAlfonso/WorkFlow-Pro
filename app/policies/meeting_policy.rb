class MeetingPolicy < ApplicationPolicy
  def index?
    true
  end

  def search?
    true
  end

  def show?
    if (@record.team_id)
      team_ids = @user.team_user_enablements.pluck(:team_id)
      team_ids.include?(@record.team_id)
    else
      @record.hosted_by == @user
    end
  end

  def create?
    if (@record.meeting_type == "team_weekly")
      @user.team_lead_for?(@record.team)
    else
      true
    end
  end

  def update?
    if (@record.meeting_type == "team_weekly")
      @record.hosted_by == @user || @user.team_lead_for?(@record.team)
    else
      @record.hosted_by == @user
    end
  end

  def destroy?
    false
  end

  def team_meetings?
    @user.teams_intersect?(@record.map { |m| m.team })
  end

  def meeting_recap?
    @user.teams_intersect?(@record.map { |m| m.team })
  end

  def meetings_by_date?
    true
  end
  
  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.optimized.from_user_teams_or_hosted_by_user(@user)
    end
  end

end