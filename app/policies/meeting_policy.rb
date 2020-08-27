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
    team_ids = @user.team_user_enablements.pluck(:team_id)
    team_ids.include?(meeting.team_id)
  end

  def create?
    @user.company_admin?
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