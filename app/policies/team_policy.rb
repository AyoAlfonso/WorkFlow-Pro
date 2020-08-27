class TeamPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    true
  end

  def show?
    team_ids = @user.team_user_enablements.pluck(:team_id)
    team_ids.include?(record.id)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.for_company(@user.company)
    end
  end
end