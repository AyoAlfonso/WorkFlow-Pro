class ScorecardLogPolicy < ApplicationPolicy

  def create?
    !user_can_observe_current_company?
  end

  def show?
    # true
    user_is_part_of_this_company?(@record.company) || @record.owned_by == @user || user_can_observe_current_company?
  end

  def destroy?
     @record.user_id == @user.id
  end

  def set_scorecard_log?
    true 
  end

  def show_scorecard_from_log?
    @record.user_id == @user.id || user_can_observe_current_company?
  end
  
  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
       scope.all
    end
  end
end
