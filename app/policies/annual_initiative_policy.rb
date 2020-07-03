class AnnualInitiativePolicy < ApplicationPolicy
  attr_reader :user, :annual_initiative

  def initialize(user, annual_initiative)
    @user = user
    @annual_initiative = annual_initiative
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