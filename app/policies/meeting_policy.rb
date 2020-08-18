class MeetingPolicy < ApplicationPolicy
  attr_reader :user, :meeting_template

  def initialize(user, meeting)
    @user = user
    @meeting = meeting
  end

  def index?
    true
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

  def show?
    @user.company_admin?
  end

  def team_meetings?
    @user.teams.ids.include?(@meeting.team_id)
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