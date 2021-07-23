class ScorecardLogPolicy < ApplicationPolicy
  def index? 
    true
  end

  def create?
    !user_can_observe_current_company?
  end

  def show?
    # true
    user_is_part_of_this_company?(@record.company) || @record.owned_by == @user || user_can_observe_current_company?
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.includes([:created_by, :user, :team ]).all
      # scope.all
    end
  end
end