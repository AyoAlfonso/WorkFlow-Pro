class MeetingPolicy < ApplicationPolicy
  attr_reader :user, :meeting_template

  def initialize(user, meeting_template)
    @user = user
    @meeting_template = meeting_template
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