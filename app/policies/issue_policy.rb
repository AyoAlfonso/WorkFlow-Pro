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
    @issue.user == @user
  end

  def destroy?
    @issue.user == @user
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
      scope.created_by_user(@user)
    end
  end
end