class ProductFeaturePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def update?
    @record.user == @user
  end

  def destroy?
    @record.user == @user
  end

  class Scope
    attr_reader :pyns, :objective, :team, :meeting, :company

    def initialize(context, scope)
      @user = context.user
      @pyns = pyns
      @objective = objective
      @team = team
      @meeting = meeting
      @company = company
    end

    def resolve
      scope.includes([:pyns, :objective, :team, :meeting, :company])
    end
  end
end
